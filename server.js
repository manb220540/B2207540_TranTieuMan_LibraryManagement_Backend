// backend/server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const seedAdmin = require('./scripts/seedAdmin');
require('dotenv').config();
// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const publisherRoutes = require('./routes/publisherRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Seed default admin
seedAdmin();

// Attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/publishers', publisherRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/users', userRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId); // Join room based on user ID
  });
});

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});