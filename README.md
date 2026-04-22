<div align="center">
  <img src="./frontend/public/demo.png" alt="Shortify Banner" />
  
  <br />

  [![Docker](https://img.shields.io/badge/Docker-Hub-2496ed?style=for-the-badge&logo=docker)](https://hub.docker.com/r/adityakumar91/url-shortner)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
  [![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
  [![Redis](https://img.shields.io/badge/Upstash_Redis-dc2626?style=for-the-badge&logo=redis)](https://upstash.com)
  [![MongoDB](https://img.shields.io/badge/MongoDB-7.x-059669?style=for-the-badge&logo=mongodb)](https://mongodb.com)

  <h3>🚀 Shortify: A High-Performance, Dockerized URL Shortener</h3>
  
  <p>
    <b>Shortify</b> is a professional-grade URL shortening service built for speed, scalability, and elegance. Transform long, cluttered links into clean, trackable aliases with sub-millisecond redirection thanks to Upstash Redis.
  </p>

  <p>
    <a href="https://aditya-dev-portfolio-iota.vercel.app/"><b>✨ View Portfolio</b></a> • 
    <a href="https://github.com/Adityamkumar"><b>🔗 Github</b></a> • 
    <a href="#-setup-instructions"><b>🚀 Setup</b></a>
  </p>
</div>

---

## ✨ Features

- ⚡ **Lightning Fast**: Redirects optimized with **Upstash Redis** caching for near-zero latency.
- 🏷️ **Custom Aliases**: Create branded, memorable links instead of random strings.
- 📊 **Real-time Analytics**: Detailed tracking of visit counts and link performance.
- 🛡️ **Intelligent Rate Limiting**: Built-in protection to prevent API abuse.
- 🐳 **Docker Support**: Fully containerized for seamless deployment.
- 🎨 **Premium UI**: Modern dark-themed interface built with **React 19** and **Tailwind CSS 4.0**.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript | Type-safe, interactive user interface. |
| **Backend** | Node.js + Express | Scalable asynchronous API engine. |
| **Database** | MongoDB + Mongoose | Persistent storage for URL metadata. |
| **Caching** | Upstash Redis | High-speed global cache for redirections. |
| **Styling** | Tailwind CSS 4.0 | Next-gen utility-first CSS styling. |
| **Container** | Docker | Consistent environment and deployment. |

---

## 🚀 Setup Instructions

### 1️⃣ Local Development Setup

To run this project locally, clone the repository and install dependencies for both the frontend and backend.

```bash
# Clone the repository
git clone https://github.com/Adityamkumar/Url_Shortner.git
cd Url_Shortner

# Setup Backend
cd backend
npm install
npm run dev

# Setup Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

### 2️⃣ Environment Variables

Create a `.env` file in the `backend/` directory and configure the following:

```env
PORT=6000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
REDIS_TTL=3600
```

---

## 🐳 Docker Support

### Build Image Locally
If you want to build the backend image yourself:
```bash
cd backend
docker build -t my-url-shortner .
```

### Run Container Locally
Run the container using your local `.env` file:
```bash
docker run -p 6000:6000 --env-file .env my-url-shortner
```

### Pull from Docker Hub
You can pull and run the official pre-built image directly:
```bash
# Pull the latest image
docker pull adityakumar91/url-shortner:latest

# Run the container
docker run -p 6000:6000 --env-file .env adityakumar91/url-shortner:latest
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/shortId` | Generate a shortened URL (supports custom aliases) |
| `GET` | `/api/v1/analytics/:shortId` | Fetch visit count and analytics |
| `GET` | `/:shortId` | Redirect to the original long URL |

---

<p align="center">
  Developed with ❤️ by <a href="https://aditya-dev-portfolio-iota.vercel.app/">Aditya</a>
</p>
