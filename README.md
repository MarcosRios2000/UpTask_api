# UpTask API

RESTful API for managing users, projects, tasks, and teams.  
Built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, and **JWT** authentication.  
Email services are handled via **Resend**.

---

## 🛠️ Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **MongoDB** (Mongoose)
- **JWT** (JSON Web Tokens)
- **Resend** (Email service)
- **CORS** & **Morgan** middleware
- **Nodemon** (development)

---

## 🚀 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/uptask_api.git
cd uptask_api
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a `.env` file** at the root of the project with the following environment variables:

```dotenv
DATABASE_URL=your_mongo_atlas_connection_string
FRONTEND_URL=your_frontend_deployment_url
JWT_SECRET=your_secret_key
RESEND_API_KEY=your_resend_api_key
```

---

## 📜 Scripts

| Command            | Description                                  |
|--------------------|----------------------------------------------|
| `npm run dev`       | Run the development server with Nodemon     |
| `npm run dev:api`   | Run server in public API mode               |
| `npm run build`     | Compile TypeScript to JavaScript (`/dist`)  |
| `npm run start`     | Start the compiled project from `/dist`     |

---

## ✨ Features

- User Authentication (register, login, email confirmation, password reset)
- JWT Authorization Middleware
- CRUD for Projects and Tasks
- Task State Management
- Role Management (Manager / Team Member)
- Email Notifications via Resend
- Input Validation with Express Validator

---

## ☁️ Deployment Notes

- **Backend deployed** on [Render](https://render.com/)
- **MongoDB** hosted on [MongoDB Atlas](https://www.mongodb.com/atlas)
- CORS settings restrict API access to the frontend domain
- API runs on dynamic ports provided by Render

---

## 📄 License

This project is licensed under the **ISC License**.
