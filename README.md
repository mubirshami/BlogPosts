# Blog Management System

A full-stack blog management system built with React and Node.js, featuring JWT authentication, rich text editing, and a modern UI.


## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Features](#features)

## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Quill** - Rich text editor
- **Axios** - HTTP client
- **Zod** - Schema validation
- **Context API** - State management

## 🏗 Architecture

### Backend Architecture (Controller-Services Pattern)

```
Request → Routes → Controllers → Services → Models → Database
```

- **Routes**: Define API endpoints and call controllers
- **Controllers**: Handle HTTP requests/responses, validation
- **Services**: Contain business logic and database operations
- **Models**: Define database schemas (User, Post)
- **Middleware**: Authentication (`auth.js`) and authorization (`authorize.js`)

### Frontend Architecture

```
Components → Context API → Services → API Utils → Backend
```

- **Components**: React UI components (Login, Register, PostList, etc.)
- **Context API**: Global state management (AuthContext)
- **Services**: API service functions (authService, postService)
- **Utils**: Axios configuration with interceptors

### Authentication Flow

1. User registers/logs in → Backend validates and returns JWT token
2. Frontend stores token in localStorage
3. Axios interceptor attaches token to all requests
4. Backend middleware validates token on protected routes
5. Owner authorization checks if user owns the resource

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/blogdb
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogdb
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   
   **For local development:**
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

## 📚 API Documentation
### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token_here"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token_here"
  }
}
```

### Blog Post Endpoints

#### Get All Posts (Public)
```http
GET /api/posts
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "post_id",
      "title": "My First Post",
      "content": "Post content...",
      "authorId": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

#### Get Post by ID (Public)
```http
GET /api/posts/:id
```

#### Create Post (Authenticated)
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My New Post",
  "content": "<p>Rich text content here...</p>"
}
```

#### Update Post (Owner Only)
```http
PUT /api/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "<p>Updated content...</p>"
}
```

#### Delete Post (Owner Only)
```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

### Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error 

## ✨ Features

### Backend Features
- ✅ JWT-based authentication system
- ✅ Password hashing with bcrypt
- ✅ MongoDB database with Mongoose ODM
- ✅ Controller-Services architecture
- ✅ Protected routes with middleware
- ✅ Owner-based authorization (users can only edit/delete their own posts)
- ✅ RESTful API design
- ✅ Error handling middleware
- ✅ CORS configuration

### Frontend Features
- ✅ User authentication (Login/Register)
- ✅ Protected routes
- ✅ Blog post CRUD operations
- ✅ Rich text editor (React Quill)
- ✅ Form validation with Zod
- ✅ Responsive design with Tailwind CSS
- ✅ Context API for state management
- ✅ Custom alert and confirmation dialogs
- ✅ Loading states and error handling
- ✅ Modern, professional UI

### Security Features
- ✅ Password hashing (bcrypt)
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ Owner authorization
- ✅ Input validation (Zod)
- ✅ CORS protection











**Note:** Make sure to replace placeholder values (like MongoDB URI and JWT secret) with your actual credentials before running the application.
