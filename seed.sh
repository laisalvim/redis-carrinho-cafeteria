#!/bin/sh
set -e
REDIS_HOST=${REDIS_HOST:-127.0.0.1}
REDIS_PORT=${REDIS_PORT:-6379}

# Produtos do cardápio
redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" HSET prod:CAF001 nome "Super Coffee"    preco 4.50 img "/./img/super_coffee.png"
redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" HSET prod:CAF002 nome "Mocha Delicious" preco 4.80 img "/./img/mocha_delicious.png"
redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" HSET prod:CAF003 nome "Latte Love"      preco 4.20 img "/./img/latte_love.png"

# Ordem do cardápio
redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" DEL menu:itens
redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" RPUSH menu:itens CAF001 CAF002 CAF003

echo "Seed OK em ${REDIS_HOST}:${REDIS_PORT}"
