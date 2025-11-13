# Docker Compose для Shispare Frontend

## Требования
- Docker 20.10+
- Docker Compose 2.0+

## Быстрый старт

1. **Убедитесь, что общая Docker сеть создана** (запустите в backend проекте):
```bash
# В папке shispare-backend
docker network create shispare-network
# или используйте скрипт: ./scripts/create-network.sh
```

2. (Опционально) Создайте файл `.env` для настройки API URL:
```bash
# Для production через прокси (рекомендуется)
# Оставьте пустым или не создавайте - будет использоваться прокси Nginx

# Для development без Docker
echo "VITE_API_URL=http://localhost:3000/shispare" > .env
```

3. Запустите контейнер:
```bash
docker-compose up -d
```

3. Приложение будет доступно по адресу: **http://localhost:5173**

4. Проверьте статус:
```bash
docker-compose ps
```

5. Просмотрите логи:
```bash
docker-compose logs -f frontend
```

## Остановка

```bash
docker-compose down
```

## Пересборка образа

```bash
docker-compose build --no-cache
docker-compose up -d
```

## Перезапуск

```bash
docker-compose restart frontend
```

## Переменные окружения

Если нужно изменить URL API, создайте файл `.env`:
```env
VITE_API_URL=http://localhost:3000/shispare
```

**Важно:** После изменения переменных окружения необходимо пересобрать образ, так как Vite встраивает переменные на этапе сборки:
```bash
docker-compose build --no-cache
docker-compose up -d
```

## Структура

- **frontend** - контейнер с Nginx, обслуживающий собранное React приложение
  - Порт: `5173` (внешний) -> `80` (внутренний Nginx)
  - Все маршруты SPA перенаправляются на `index.html`
  - **Проксирование API**: запросы к `/shispare/` проксируются на `backend:3000`
  - **Socket.IO прокси**: запросы к `/socket.io/` проксируются на `backend:3000`
  - Gzip compression включен
  - Кэширование статических файлов настроено
  - Health check endpoint: `http://localhost:5173/health`
  - Подключен к общей сети `shispare-network` для взаимодействия с backend

## Процесс сборки

1. **Stage 1 (build)**: Node.js образ для сборки
   - Устанавливает зависимости
   - Собирает React приложение (`npm run build`)
   
2. **Stage 2 (production)**: Nginx образ
   - Копирует собранные файлы из stage 1
   - Настраивает Nginx для SPA

## Nginx конфигурация

Конфигурация находится в `nginx.conf`:
- SPA routing (все запросы -> index.html)
- Gzip compression
- Кэширование статических файлов
- Security headers
- Health check endpoint

## Проблемы и решения

### Приложение не открывается
```bash
# Проверьте логи
docker-compose logs frontend

# Проверьте, не занят ли порт 5173
lsof -i :5173

# Проверьте статус контейнера
docker-compose ps
```

### Изменения не применяются
- Убедитесь, что пересобрали образ после изменений
- Проверьте, что изменения были включены в сборку
- Очистите кэш браузера

### Проблемы с API запросами
- Проверьте переменную `VITE_API_URL` в `.env`
- Убедитесь, что бэкенд доступен по указанному URL
- Проверьте CORS настройки на бэкенде

