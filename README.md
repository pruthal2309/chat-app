# QuickChat - Real-Time Chat Application

🔥 **Live Demo**: [https://chat-app-one-taupe-48.vercel.app](https://chat-app-one-taupe-48.vercel.app)

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. 

## ✨ Key Features

- **Real-Time Messaging**: Lightning-fast instant messaging powered by Socket.IO.
- **Read Receipts (Blue Ticks)**: Real-time seen/read indicators.
- **Typing Indicators**: See when the other person is typing in real-time.
- **Message Replies**: Reply directly to specific messages in a conversation.
- **Emoji Reactions**: React to any message with emojis.
- **Message Deletion**: Delete sent messages on both sides.
- **Media Sharing**: Upload and share images within the chat (powered by Cloudinary).
- **Live Profile Updates**: Changing your profile picture or name instantly updates on everyone else's screen without refreshing.
- **Online Status**: Live indicators showing who is currently online.
- **User Authentication**: Secure signup and login using JWT tokens and bcrypt.
- **Responsive Design**: Beautiful, glassmorphic UI built with TailwindCSS for seamless mobile and desktop experiences.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, TailwindCSS, Socket.IO Client, Axios
- **Backend**: Node.js, Express.js, Socket.IO, Mongoose (MongoDB)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **File Storage**: Cloudinary

## 🚀 Deployment Guide

This application is designed to be easily deployed on modern cloud hosting providers.
* **Frontend:** Best deployed to **Vercel** or **Netlify**.
* **Backend:** Best deployed to **Render**, **Railway**, or **Heroku**. 

*(Ensure that you set the `CLIENT_URL` environment variable on your backend server so that CORS allows the frontend to connect via WebSockets).*

## 💻 Prerequisites

Before running the application locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account for image uploads.

## 🏃 Getting Started Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/pruthal2309/chat-app.git
cd chat-app
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

# Cloudinary Variables
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm run server
```

The server should be running on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The application should now be running on `http://localhost:5173`.
