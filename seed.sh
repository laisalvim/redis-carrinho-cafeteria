#!/bin/sh
set -e
REDIS_HOST=${REDIS_HOST:-127.0.0.1}
REDIS_PORT=${REDIS_PORT:-6379}

redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" HSET prod:CAF001 nome "Café Expresso" preco 7.50 img "/imgs/expresso.jpg"
redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" HSET prod:CAF002 nome "Cappuccino"    preco 12.00 img "/imgs/capp.jpg"
redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" HSET prod:CAF003 nome "Pão de Queijo" preco 6.00  img "/imgs/pdq.jpg"

redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" DEL menu:itens
redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" RPUSH menu:itens CAF001 CAF002 CAF003
echo "Seed OK em ${REDIS_HOST}:${REDIS_PORT}"
