**Read in other languages: [Українська](README.md), [English](README.en.md).**

# Design Lab

FullStack application (MERN Stack)

## 🚀 Проєкт Design Lab

Design Lab - це веб-додаток для розповсюдження цифрових продуктів.
Він надає користувачам можливість переглядати цифрові продукти, а також скачувати, якщо мати преміум-доступ.

## 🛠 Технології

### Frontend

- **React.js (Vite)** - Швидка розробка за допомогою сучасного інструменту.
- **TypeScript** - Строга типізація JavaScript для розробки.
- **Redux Toolkit** - Ефективне управління станом.
- **React Router** - Маршрутизація на стороні клієнта.
- **Sass** - Стилізація.
- **Axios** - Обробка запитів API.
- **React DnD** - Функціональність перетягування для сортування.

### Backend

- **Node.js (Express.js)** - Платформа для бекенду.
- **MongoDB (Mongoose)** - База даних NoSQL.
- **JWT Аутентифікація** - Безпечні сеанси користувачів.
- **Backblaze B2** - Зберігання файлів на хмарному сховищі.
- **WayForPay API** - Оплата підписки.
- **Multer** - Управління завантаженням файлів.

## 📂 Структура проекту

```
/design-lab
│── backend
│   ├── src
│   │   ├── controllers
│   │   ├── decorators
│   │   ├── helpers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── schemas
│   │   ├── types
│   │   ├── app.ts
│   │   ├── main.ts
│   ├── .env
│   │── package.json
│
│
│── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── helpers
│   │   ├── redux
│   │   ├── schema
│   │   ├── screens
│   │   ├── styles
│   │   ├── types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   ├── public
│   ├── 404.html
│   ├── index.html
│   ├── .env
│   │── package.json
│
│
│── package.json
│── README.md
│── yarn.lock
```

## ⚙️ Функціонал

- ✅ **Аутентифікація** (реєстрація (з підтвердженням через Email), вхід, вихід через токен)
- ✅ **Каталог постів** цифрового контенту
- ✅ **Пошук постів** цифрового контенту
- ✅ **Дадавання постів до обранного** та його перегляд
- ✅ **Оплата через WayForPay** (щомісячна підписка)
- ✅ **Публікація цифрового контенту** (можливість завантаження фото та файлів для адміністратора)
- ✅ **Drag & Drop Sorting** (можливість перегрупувати зображення перед завантаженням)
- ✅ **Можливість запланованого викладення посту** (по даті і часу)
- ✅ **Адміністративна панель Dashboard** (можливість котролювати пости і підписників)
- ✅ **Адміністративне керування підписками** (можливість адміністраторам відкрити преміум обраним юзерам)
- ✅ **Зберігання файлів** на хмарному сховищі B2 Backblaze
- ✅ **Перевірка статусу підписки**
- ✅ **Можливість скасувати підписку у власному профілі**
- ✅ **Світла \ темна тема для сайту**
- ✅ **Модальні вікна** для взаємодії з користувачем
- ✅ **Захист маршрутів (Private Routes)**

## 🔧 Налаштування та запуск

### 1️⃣ Клонування репозиторію

```sh
git clone https://github.com/Aleks-corp/design-lab.git
cd design-lab
```

### 2️⃣ Налаштування бекенду

```sh
cd ./backend
yarn install
yarn build
cp .env.example .env
# Заповнити змінні в .env приклад в .env.example
yarn dev
```

### 3️⃣ Налаштування фронтенду

```sh
cd ./frontend
yarn install
yarn build
cp .env.example .env
# Заповнити змінні в .env приклад в .env.example
yarn start
```

## 🌐 Деплой

- **Frontend:** Render ([https://design-lab.onrender.com](https://design-lab.onrender.com))
- **Backend:** [Render](https://render.com/)
- **Сховище:** [Backblaze B2](https://www.backblaze.com/)
- **База:** [MongoDB Atlas](https://cloud.mongodb.com/)

## 🏆 Автоматизація

- **Запуск MongoDB** через Mongo Atlas
- **Запуск бекенду** на Render
- **Зберігання данних** на B2 Backblaze
- **Запуск фронтенду** на Render
- **Оплата підписки** через WayForPay API

## 💡 Можливі покращення

- Додати підтримку для покупки одного файлу без підписки
- Додати статистику по завантаженню файлів по категоріям для адміністратора
- Додати аватар юзерам
- Додати коментарі для постів

## 📬 Контакти

Якщо у вас є запитання або пропозиції, пишіть на email: [**aleks.haran.dev@gmail.com**](mailto:aleks.haran.dev@gmail.com)

---

_Вдалого користування Design Lab!_ 🚀
