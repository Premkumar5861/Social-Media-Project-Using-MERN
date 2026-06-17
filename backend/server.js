const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const chatRoutes = require('./routes/chatRoutes');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

dotenv.config();

const app = express();

// CORS configuration for deployed frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://socialmedia-backend-5j7u.onrender.com',
    'https://frontapp.io',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.send('API is running')
});

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
console.log('📁 Serving static files from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://socialmedia-backend-5j7u.onrender.com',
      'https://frontapp.io',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST']
  },
});

io.on('connection', (socket) => {
    console.log('New client connected');
  
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat ${chatId}`);
    });
  
    socket.on('sendMessage', (message) => {
      console.log(`Message received from client: ${message.content}`);
      io.to(message.chatId).emit('receiveMessage', message);
      console.log(`Message sent to chat ${message.chatId}: ${message.content}`);
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  

const PORT = process.env.PORT || 5000;
server.listen(PORT, console.log(`Server is running at PORT ${PORT}`));
