Zentro‑Backend
Минимальный Node.js‑сервер, выполняющий роль транспортного слоя между клиентом Zentro‑App и приватным GitHub‑репозиторием Zentro‑Messages.

Сервер не хранит ключей, не расшифровывает сообщения, не знает участников. Он только принимает зашифрованные данные и отправляет их в GitHub.

🎯 Функции
Загрузка зашифрованных сообщений в приватный GitHub‑репозиторий
Получение списка сообщений из репозитория
Загрузка/выдача зашифрованных ключей чатов
Работа через GitHub REST API
Безопасная авторизация через GitHub PAT
Без криптографии на стороне сервера
🛠️ Технологии
Компонент	Версия/Описание
Node.js	18+
Framework	Express или Fastify
API	GitHub REST API
Формат данных	JSON
⚙️ Установка и запуск
Переменные окружения
Создайте файл .env в корне проекта:

env


GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=your-github-username
GITHUB_REPO=Zentro-Messages
Команды
bash


# Установка зависимостей
npm install

# Запуск сервера
npm run start
📁 Структура репозитория Zentro-Messages


Zentro-Messages/
├── chats/
│   └── <chat_id>/
│       └── <uuid>.json          # Зашифрованные сообщения
└── keys/
    └── <chat_id>/
        └── <fingerprint>.json   # Зашифрованные ключи чатов
🔒 Безопасность
✅ Backend не хранит приватных ключей

✅ Backend не расшифровывает сообщения

✅ Все данные передаются только в зашифрованном виде (ciphertext)

✅ Доступ к GitHub осуществляется только через PAT

✅ Репозиторий Zentro-Messages должен быть приватным

📄 Лицензия
MIT License
