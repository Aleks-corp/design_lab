**Read in other languages: [Українська](README.md), [English](README.en.md).**

# DesignUA Lab - FullStack Application (MERN Stack)

## 🚀 Overview

DesignUA Lab is a web platform for browsing and downloading digital design assets via a subscription model. The platform updates daily with new design content and offers a seamless user experience.

## 🛠 Technologies Used

### Frontend

- **React.js (Vite)** – Fast development with modern tooling.
- **TypeScript** – Strongly typed JavaScript for maintainability.
- **Redux Toolkit** – Efficient state management.
- **React Router** – Client-side routing.
- **Sass** – Customizable styling.
- **Axios** – API request handling.
- **React DnD** – Drag & drop functionality for admin sorting.

### Backend

- **Node.js (Express.js)** – Lightweight backend framework.
- **MongoDB (Mongoose)** – NoSQL database.
- **JWT Authentication** – Secure user sessions.
- **WayForPay API** – Payment handling (Visa, Mastercard, Apple Pay, Google Pay).
- **Backblaze B2** – Cloud storage for assets.
- **Multer** – File upload management.

## 📂 Project structure

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

## 📂 Features

- ✅ **Authentication** – Sign up (with email verification), login, logout.
- ✅ **Catalog of Digital Content** – Browse and view designs.
- ✅ **Search Functionality** – Find digital assets easily.
- ✅ **Favorites System** – Users can save preferred designs.
- ✅ **Subscription-Based Access** – Free browsing, downloads for subscribers.
- ✅ **Drag & Drop Sorting** – Admins can reorder images before upload.
- ✅ **Scheduled Post Publishing** – Set specific dates and times for posts.
- ✅ **Admin Dashboard** – Manage posts and subscribers.
- ✅ **Admin Subscription Control** – Grant premium access to selected users.
- ✅ **Payment Integration** – Secure transactions via WayForPay.
- ✅ **Cloud Storage** – Store files on Backblaze B2.
- ✅ **Subscription Status Verification** – Check user access level.
- ✅ **Subscription Cancellation** – Users can cancel via their profile.
- ✅ **Dark/Light Theme Toggle** – Customizable UI experience.
- ✅ **Private Routes Protection** – Secure content access.
- ✅ **Modal Windows** – Enhanced user interaction.

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```sh
git clone https://github.com/your-repo/design-lab.git
cd design-lab
```

### 2️⃣ Backend Setup

```sh
cd ./backend
yarn install
yarn build
cp .env.example .env
# Fill in required environment variables
yarn dev
```

### 3️⃣ Frontend Setup

```sh
cd ../frontend
yarn install
yarn build
cp .env.example .env
# Fill in required environment variables
yarn start
```

## 🌐 Deployment

- **Frontend:** [Render](https://design-lab.onrender.com)
- **Backend:** [Render](https://render.com)
- **Storage:** [Backblaze B2](https://www.backblaze.com/)
- **Database:** [MongoDB Atlas](https://cloud.mongodb.com/)

## 💡 Possible Improvements

- Add support for purchasing individual files without a subscription.
- Implement download statistics by category for admins.
- Add user avatars.
- Enable comments on posts.

## ❓ FAQ

See our [FAQ section](https://design-lab.onrender.com/faq) for common questions and troubleshooting.

## 📝 License

This project is open-source and available under the MIT License.

## 📬 Contact

For inquiries or support, email us at [**aleks.haran.dev@gmail.com**](mailto:aleks.haran.dev@gmail.com).

---

_Join DesignUA Lab today to access premium digital assets!_ 🚀
