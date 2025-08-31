const express = require('express');
const { createClient } = require('redis');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const PORT = parseInt(process.env.PORT || '3000', 10);

const redis = createClient({ socket: { host: REDIS_HOST, port: REDIS_PORT } });
redis.on('error', (err) => console.error('Redis error:', err));

app.get('/health', async (_req, res) => {
  try { res.json({ ok: true, pong: await redis.ping() }); }
  catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// Lê SKUs da List e monta os itens do cardápio a partir dos Hashes prod:*
app.get('/menu', async (_req, res) => {
  try {
    const skus = await redis.lRange('menu:itens', 0, -1);
    const items = [];
    for (const sku of skus) {
      const data = await redis.hGetAll(`prod:${sku}`);
      items.push({ sku, nome: data.nome, preco: parseFloat(data.preco), img: data.img });
    }
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Adiciona/incrementa item no carrinho (Hash cart:{sid}:items)
app.post('/cart/add', async (req, res) => {
  const { sid, sku, qtd } = req.body || {};
  if (!sid || !sku) return res.status(400).json({ error: 'sid e sku são obrigatórios' });
  const n = parseInt(qtd || 1, 10);
  const key = `cart:${sid}:items`;
  try {
    await redis.hIncrBy(key, sku, n);
    await redis.expire(key, 1800); // 30min
    res.json({ ok: true, cart: await redis.hGetAll(key) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Decrementa; se zerar, remove o campo
app.post('/cart/dec', async (req, res) => {
  const { sid, sku, qtd } = req.body || {};
  if (!sid || !sku) return res.status(400).json({ error: 'sid e sku são obrigatórios' });
  const n = Math.abs(parseInt(qtd || 1, 10));
  const key = `cart:${sid}:items`;
  try {
    const after = await redis.hIncrBy(key, sku, -n);
    if (after <= 0) await redis.hDel(key, sku);
    await redis.expire(key, 1800);
    res.json({ ok: true, cart: await redis.hGetAll(key) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Retorna carrinho com subtotais e total
app.get('/cart', async (req, res) => {
  const { sid } = req.query;
  if (!sid) return res.status(400).json({ error: 'sid é obrigatório' });

  const key = `cart:${sid}:items`;
  try {
    const raw = await redis.hGetAll(key);
    const items = [];
    let total = 0;

    for (const [sku, qtyStr] of Object.entries(raw)) {
      const qty = parseInt(qtyStr, 10);
      const prod = await redis.hGetAll(`prod:${sku}`);
      const preco = parseFloat(prod.preco || '0');
      const subtotal = qty * preco;
      total += subtotal;
      items.push({ sku, nome: prod.nome, preco, qtd: qty, subtotal: parseFloat(subtotal.toFixed(2)) });
    }

    res.json({ items, total: parseFloat(total.toFixed(2)) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Limpa carrinho
app.post('/cart/clear', async (req, res) => {
  const { sid } = req.body || {};
  if (!sid) return res.status(400).json({ error: 'sid é obrigatório' });
  await redis.del(`cart:${sid}:items`);
  res.json({ ok: true });
});

// Sobe servidor e conecta no Redis
app.listen(PORT, async () => {
  await redis.connect();
  console.log('Redis conectado?', redis.isOpen);
  console.log('PING =>', await redis.ping());
  console.log(`Server on http://localhost:${PORT}`);
});
