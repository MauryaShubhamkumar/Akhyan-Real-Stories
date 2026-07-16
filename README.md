# 📖 Akhyan (आख्यान)

> **Stories worth telling.** A quiet place for the things we don't usually say out loud.

Akhyan is a reading-first, distraction-free platform for writing and reading real personal stories, memories, struggles, love stories, and life experiences. It is built to enable deep, comfortable reading with neutral tone-based light and dark themes. Users can write under their own username or post completely anonymously.

---

## 🚀 Live Demo

👉 :contentReference[oaicite:0]{index=0}

---
## ✨ Features

- **🔐 Robust Authentication**: Secure password hashing via `bcrypt` and HTTP-only cookie-based JWT sessions.
- **👁️ Privacy First**: Publish stories anonymously while retaining management and deletion controls.
- **📊 Story Analytics**: Personal dashboard highlighting total story count, unique content views, and metrics broken down by category.
- **🏷️ Feed Filtering**: Categories feed including Struggles, Love Stories, School Life, College Life, and General.
- **💬 Community Interaction**: Commenting systems, and support for active Like / Dislike reactions.
- **🛡️ Content Moderation**: Integrated system for reporting inappropriate posts and comments.
- **🔗 Quick Share**: Integrated native Web Share API, direct WhatsApp sharing, and instant link copying.
- **🌓 Adaptive Interface**: Sleek dark and light modes styled with Vanilla CSS transitions.

---

## 🛠️ Tech Stack

| Frontend | Backend |
| :--- | :--- |
| **Framework**: React 19 (TypeScript) | **Runtime**: Node.js & Express |
| **Build Tool**: Vite 8 | **Database**: MongoDB & Mongoose |
| **Router**: React Router 7 | **Validation**: Zod Schemas |
| **Styling**: Tailwind CSS v4 & CSS Variables | **Security**: Helmet, CORS, and Sanitized HTML |
| **HTTP Client**: Axios | **Auth**: JSON Web Tokens (JWT) & bcrypt |

---

## 📂 Project Structure

```text
akhyan/
├── backend/                  # Express REST API (Node.js + TS)
│   ├── src/
│   │   ├── config/           # Database & Env validations
│   │   ├── controllers/      # Route request handlers
│   │   ├── middleware/       # JWT Auth, Visitor UUIDs, and Optional Auth
│   │   ├── models/           # Mongoose schemas (User, Post, Reaction, View)
│   │   ├── routes/           # Express routers
│   │   └── schemas/          # Zod validation rules
│   ├── .env.example
│   └── tsconfig.json
├── frontend/                 # Single Page Application (React + Vite)
│   ├── src/
│   │   ├── api/              # Axios instance configuration
│   │   ├── components/       # Layouts, Modal dialogs, and Protected wrappers
│   │   ├── context/          # Auth Context & Theme Context
│   │   ├── pages/            # Story listings, Editor, Profile Dashboard, and 404
│   │   └── types/            # TypeScript definitions
│   ├── index.html
│   └── vite.config.ts
└── README.md                 # Project root documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection URI.

### 1. Environment Configurations

#### Backend Environment (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

#### Frontend Environment (`frontend/.env`)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

### 2. Installation & Running

#### Start the Backend API

```bash
cd backend
npm install
npm run dev
```

#### Start the Frontend Client

```bash
cd ../frontend
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser!

---

## ⚙️ Building for Production

### Compile Backend TypeScript

```bash
cd backend
npm run build
npm start
```

### Build Frontend Single Page App

```bash
cd frontend
npm run build
npm run preview
```
