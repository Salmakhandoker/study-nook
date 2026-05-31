# 📚 StudyNook

StudyNook is a modern web application built with **Next.js**, **MongoDB**, and **Better Auth** that provides authentication (email/password + Google login) and a scalable backend architecture using API routes and MongoDB integration.

---

## 🚀 Features

- 🔐 Authentication system (Email & Password)
- 🔑 Google OAuth login
- 🧠 MongoDB database integration
- ⚡ Next.js App Router architecture
- 🌐 Proxy/API-based backend structure
- 🛡️ Secure auth with Better Auth
- 📱 Responsive UI ready

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router)
- **Backend:** Next.js API Routes
- **Database:** MongoDB
- **Auth:** Better Auth
- **Language:** JavaScript (Node.js)

---

## 📁 Project Structure
## ⚙️ Environment Variables

Create a `.env.local` file in the root:

```env
MONGODB_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

📦 Installation
# 1. Clone the repository
git clone https://github.com/your-username/studynook.git

# 2. Move into project
cd studynook

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev
🔐 Authentication Flow
User registers or logs in via email/password
Or uses Google OAuth
Better Auth handles session management
MongoDB stores user and session data
🧪 Common Issues
❌ Module not found: mongodb

Make sure file path is correct:



Ensure you are passing:

const db = client.db("studynookDB");
🌐 API Routes
Route	Method	Description
/api/auth/*	ALL	Authentication endpoints
📌 Notes
Always ensure MongoDB connection is established before auth initialization
Restart server after environment variable changes

Keep Google OAuth redirect URL updated:

http://localhost:3000/api/auth/callback/google
🧑‍💻 Author
Salma khandoker;

Built by StudyNook Developer

📄 License

This project is open-source and free to use.


---


