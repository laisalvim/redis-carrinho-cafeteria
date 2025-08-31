# NoSQL - Carrinho de Compras

Este projeto é um exercício **Redis** como um banco
de dados NoSQL para gerenciar um carrinho de compras de uma cafeteria online.  
A aplicação permite que os usuários visualizem um cardápio, adicionem itens ao
carrinho e consultem o total, tudo integrado ao Redis.

O Redis foi utilizado para armazenar os dados do cardápio e do carrinho de compras.  
As principais estruturas de dados aplicadas foram:
- **Hash** → detalhes de cada produto (nome, preço, imagem)  
- **List** → ordem do cardápio exibido  
- **Hash por sessão** → carrinho de cada usuário, com expiração automática (TTL)  

---

## Como Rodar o projeto

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Redis](https://redis.io/) (pode ser rodado em contêiner local ou no **Play with Docker**)

### Passos

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/laisalvim/redis-carrinho-cafeteria
   cd redis-carrinho-cafeteria

2. **Suba o Redis (exemplo com Play with Docker):**
   ```bash
  apk update
  apk add redis
  redis-server --protected-mode no &
  redis-cli ping 

3. **Instale as dependências:**
npm install

4. **Popule o catálogo inicial:**
sh seed.sh

5. **Inicie o servidor:**
npm start

A aplicação rodará em http://localhost:3000
