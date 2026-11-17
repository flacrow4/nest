FROM ubuntu:latest
LABEL authors="jy"

ENTRYPOINT ["top", "-b"]


# Этап 1: Сборка (builder)
FROM node:20-alpine AS builder

WORKDIR /app

# Сначала копируем только файлы зависимостей, чтобы использовать кеш Docker
COPY package*.json ./
RUN npm ci

# Копируем исходный код и собираем проект
COPY . .
RUN npm run build

# Этап 2: Продакшен (production)
FROM node:20-alpine

WORKDIR /app

# Копируем только production-зависимости
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Копируем собранный код из этапа сборки
COPY --from=builder /app/dist ./dist

# Открываем порт, который слушает NestJS (по умолчанию 3000)
EXPOSE 3000

# Команда для запуска приложения
CMD ["node", "dist/main"]