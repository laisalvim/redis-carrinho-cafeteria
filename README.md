# carrinho de compras
## 1) Arquitetura e papéis
- **Client**: `public/index.html` (HTML/CSS/JS simples).
- **Server**: `server.js` (rotas REST).
- **Database**: armazena catálogo e carrinho.

## 2) Estruturas no Redis 
- **catálogo (Hash por produto)**: `prod:{sku}`  
  Campos: `nome`, `preco`, `img`  
- **ordem do cardápio (List)**: `menu:itens`  
  Contém SKUs na ordem exibida no front.
- **Carrinho por sessão (Hash)**: `cart:{sid}:items`  
  Mapeia `sku -> quantidade` com **TTL** (`EXPIRE 1800`).

---
## 3) Rodando no Play with Docker

### Nó 1 — Redis
```sh
apk add redis
redis-server --protected-mode no &
redis-cli ping
# anote o IP deste nó (ex.: 192.168.0.19)
