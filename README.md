# Social Media Application using MERN Stack

## Overview

This project is a full-stack Social Media Application built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). The application allows users to register, log in securely, upload profile pictures, search for other users, follow and unfollow users, and enable Two-Factor Authentication (2FA) for additional security.

The main objective of this project was to gain practical experience in building a complete social networking platform while understanding how frontend and backend systems communicate in a real-world application.

---

## Features

### Authentication System

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Password Encryption using bcrypt

### User Profile

* View Profile Information
* Update Username, Email, and Password
* Upload Profile Picture
* Profile Picture Storage using Multer

### User Search

* Search users by username
* Case-insensitive search using MongoDB Regular Expressions

### Social Features

* Follow Other Users
* Unfollow Users
* View Followers and Following Lists

### Security Features

* JWT-based Authorization
* Protected APIs using Middleware
* Two-Factor Authentication (2FA)
* QR Code Generation using Speakeasy and QRCode

---

## Technologies Used

### Frontend

* React.js
* React Router DOM
* React Bootstrap
* Axios
* QRCode

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* Speakeasy
* express-async-handler

### Database

* MongoDB

---

## Project Structure

```bash
Social-Media-Project-Using-MERN
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   └── server.js
│
├── frontend
│   └── app
│       ├── public
│       ├── src
│       │   ├── Pages
│       │   ├── Components
│       │   ├── App.js
│       │   └── index.js
│
└── README.md
```

---

# Installation Guide

## Step 1: Clone the Repository

```bash
git clone https://github.com/Premkumar5861/Social-Media-Project-Using-MERN.git
```

```bash
cd Social-Media-Project-Using-MERN
```

---

## Step 2: Install Backend Dependencies

Navigate to backend folder:

```bash
cd backend
```

Install packages:

```bash
npm install
```

---

## Step 3: Create Environment Variables

Create a `.env` file inside the backend folder.

```env
MONGO_URI=mongodb://localhost:27017/socialmedia
JWT_SECRET=your_secret_key
```

---

## Step 4: Start MongoDB

Make sure MongoDB is running.

```bash
mongod
```

or start MongoDB service from Windows Services.

---

## Step 5: Run Backend Server

```bash
nodemon server.js
```

Server will start at:

```bash
http://localhost:5000
```

---

## Step 6: Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend/app
```

Install packages:

```bash
npm install
```

---

## Step 7: Start Frontend

```bash
npm start
```

Application will open at:

```bash
http://localhost:3000
```

---

# API Endpoints

## Authentication

### Register User

```http
POST /api/auth/register
```

### Login User

```http
POST /api/auth/login
```

---

## User Profile

### Get Profile

```http
GET /api/users/profile
```

### Update Profile

```http
PUT /api/users/profile
```

### Upload Profile Picture

```http
POST /api/users/profile/uploads
```

---

## User Search

### Search User

```http
GET /api/users/search?keyword=username
```

---

## Follow System

### Follow User

```http
POST /api/users/follow/:id
```

### Unfollow User

```http
POST /api/users/unfollow/:id
```

---

## Two-Factor Authentication

### Enable 2FA

```http
POST /api/auth/enable-2fa
```

---

# Challenges Faced During Development

While developing this project, I encountered several real-world issues that helped me understand full-stack development more deeply.

### 1. JWT Authentication Issues

Initially, protected routes were returning unauthorized errors because the token was not being sent correctly from the frontend.

#### What I Learned

* How Authorization headers work
* JWT verification process
* Middleware execution flow

---

### 2. Follow / Unfollow Logic

Managing followers and following arrays was challenging because both users' records needed to be updated simultaneously.

#### What I Learned

* MongoDB array operations
* Filtering ObjectIds
* Data consistency between related documents

---

### 3. Profile Picture Upload

Although images were uploading successfully to the uploads folder, they were not displaying in the frontend.

#### Problem

```text
Cannot GET /uploads/profilePicture.jpg
```

#### Solution

Configured static file serving:

```javascript
app.use(
  "/uploads",
  express.static(path.join(__dirname, "/uploads"))
);
```

#### What I Learned

* Static file serving in Express
* Multer configuration
* File path management

---

### 4. React State Management Errors

Sometimes React displayed errors such as:

```text
Objects are not valid as a React child
```

#### What I Learned

* Difference between objects and strings in JSX
* Proper state updates
* Component rendering lifecycle

---

### 5. Module Import Errors

I accidentally imported backend controller files directly into React components.

#### Problem

```text
Relative imports outside of src are not supported
```

#### What I Learned

* Frontend and backend should remain separated
* React communicates through APIs, not backend imports

---

### 6. MongoDB Populate Errors

I received:

```text
StrictPopulateError
```

because I attempted to populate a field that didn't exist in the schema.

#### What I Learned

* Relationship mapping in Mongoose
* Proper use of populate()
* Schema design

---

### 7. Node Version Compatibility

Using Node.js v25/v26 caused issues with React Scripts and Webpack.

#### What I Learned

* Importance of version compatibility
* Dependency management
* Why LTS versions are preferred

---

# Key Concepts Learned

Through this project, I gained hands-on experience with:

### Backend

* REST API Development
* Express Middleware
* JWT Authentication
* Password Hashing
* File Uploads
* MongoDB Relationships
* Error Handling

### Frontend

* React Hooks
* React Router
* Axios API Calls
* State Management
* Conditional Rendering
* Form Handling

### Full Stack Concepts

* Client-Server Communication
* Authentication Flow
* Secure Route Protection
* CRUD Operations
* File Handling
* Real-time User Interactions

---

# Future Improvements

Some features I plan to add in the future:

* Post Creation
* Like System
* Comments
* User Feed
* Real-Time Chat
* Notifications
* Dark Mode
* Friend Suggestions
* Email Verification
* Password Reset

---

# Conclusion

This project was a significant milestone in my MERN Stack learning journey. It provided practical exposure to building a real-world social media application from scratch. Throughout development, I faced multiple challenges related to authentication, file uploads, database relationships, and frontend-backend integration. Solving these problems improved my debugging skills, strengthened my understanding of the MERN ecosystem, and increased my confidence in developing full-stack web applications.

---

### Author

**Prem Kumar**

GitHub: [Premkumar5861 GitHub Profile](https://github.com/Premkumar5861?utm_source=chatgpt.com)

Project Repository:

[Social Media Project Using MERN](https://github.com/Premkumar5861/Social-Media-Project-Using-MERN.git?utm_source=chatgpt.com)

This version looks like a README written by a developer who actually built and debugged the project, which is ideal for recruiters, GitHub visitors, and placement reviews.
