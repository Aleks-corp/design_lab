# Design Lab

FullStack application (MERN Stack)

## 🚀 Проєкт Design Lab

Design Lab - це веб-додаток для розповсюдження робіт дизайнерів.
Він надає користувачам можливість переглядати, дизайнерські роботи, а також скачувати, якщо мати преміум-доступ.

## 🛠 Технології

**Frontend:**

- React.js (Vite)
- TypeScript
- Redux Toolkit
- React Router
- Sass
- Axios

**Backend:**

- Node.js (Express)
- MongoDB (Mongoose)
- Multer (для завантаження файлів)
- JWT (аутентифікація)
- Backblaze S3 (зберігання файлів на хмарному сховищі)
- WayForPay API (оплата підписки)

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

- ✅ **Аутентифікація** (реєстрація, вхід, вихід)
- ✅ **Перегляд постів** дизайнерів
- ✅ **Публікація дизайнів** (можливість завантаження фото та файлів для адміністратора)
- ✅ **Оплата через WayForPay** (щомісячна підписка)
- ✅ **Зберігання файлів** на хмарному сховищі S3 Backblaze
- ✅ **Перевірка статусу підписки**
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
yarn build
cp .env
# Заповнити змінні в .env приклад в .env.example
yarn dev
```

### 3️⃣ Налаштування фронтенду

```sh
cd ./frontend
yarn build
cp .env
# Заповнити змінні в .env приклад в .env.example
yarn start
```

## 🌐 Деплой

- **Frontend:** Render ([https://design-lab.onrender.com](https://design-lab.onrender.com))
- **Backend:** [Render](https://render.com/)
- **Сховище:** [Backblaze](https://www.backblaze.com/)
- **База:** [Mongo](https://cloud.mongodb.com/)

## 🏆 Автоматизація

- **Запуск MongoDB** через Mongo Atlas
- **Запуск бекенду** на Render
- **Зберігання данних** на S3 Backblaze
- **Запуск фронтенду** на Render
- **Оплата підписки** через WayForPay API

## 💡 Можливі покращення

- Додати підтримку для покупки одного файлу без підписки
- Додати обране до швидкого доступу
- Додати статистику по завантаженню файлів по категоріям
- Додати пошук та фільтри для постів

## 📝 Ліцензія

Проєкт є open-source та доступний під ліцензією MIT.

## 📬 Контакти

Якщо у вас є запитання або пропозиції, пишіть на email: [**aleks.haran.dev@gmail.com**](mailto:aleks.haran.dev@gmail.com)

---

_Вдалого користування Design Lab!_ 🚀
