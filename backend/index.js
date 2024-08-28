const express = require('express');
const dotenv = require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const appointmentRoutes = require('./routes/appointmentRoute');
const socketio = require('socket.io');
const { errorHandler } = require('./middleware/errorMiddleware');
const cp = require('cookie-parser');
const bp = require('body-parser');
const cors = require('cors');
const { protect } = require('./middleware/authMiddleware');
const connectDB = require('./config/db');
const http = require('http');

const app = express();
const server = http.createServer(app);

connectDB();

app.use(express.json());
app.use(cp());
app.use(bp.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cors({ origin: process.env.REACT_URL, credentials: true }));

app.get("/auth/isLoggedin", protect, (req, res) => {
  return res.json({ "success": true, "message": req.user });
});

app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use(errorHandler);

let users = [];

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});

const addUser = (userId, socketId) => {
  if (userId === null) return;
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  } else {
    users = users.map((user) =>
      user.userId === userId ? { ...user, socketId } : user
    );
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
io.on('connection', (socket) => {
  console.log('A user connected.');

  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', ({ senderId,receiverId, text, senderName, file }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit('getMessage', {
        members:[senderId,receiverId],
        text,
        senderName,
        file,
        createdAt: new Date(),
      });
    }
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    io.emit('getUsers', users);
    console.log('A user disconnected.');
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
