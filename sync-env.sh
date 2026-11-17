#!/bin/bash

# Проверяем, существует ли docker-compose.yml
if [ ! -f docker-compose.yml ]; then
  echo "Файл docker-compose.yml не найден!"
  exit 1
fi

# Извлекаем значения из docker-compose.yml с помощью grep и awk
DB_USER=$(grep -A 5 'environment:' docker-compose.yml | grep 'POSTGRES_USER' | awk -F: '{print $2}' | tr -d ' ')
DB_PASSWORD=$(grep -A 5 'environment:' docker-compose.yml | grep 'POSTGRES_PASSWORD' | awk -F: '{print $2}' | tr -d ' ')
DB_NAME=$(grep -A 5 'environment:' docker-compose.yml | grep 'POSTGRES_DB' | awk -F: '{print $2}' | tr -d ' ')

# Формируем содержимое для .env
# Мы используем те имена переменных, которые ожидает NestJS в orm-config.ts
cat <<EOF > .env
# Данные для подключения к базе данных
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=${DB_USER}
DATABASE_PASSWORD=${DB_PASSWORD}
DATABASE_NAME=${DB_NAME}
EOF

echo "Файл .env успешно создан/обновлен на основе docker-compose.yml"