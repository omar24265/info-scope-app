import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(express.json());

// 1. Database Connection & User Model
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/infoscope';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected successfully.'))
  .catch(err => console.error('MongoDB connection error (ensure DB is running):', err.message));

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['trainee', 'supervisor'], default: 'trainee' },
  twoFactorSecret: { type: String },
  isTwoFactorEnabled: { type: Boolean, default: false },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', UserSchema);

// 2. Authentication & 2FA Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/2fa/generate', async (req, res) => {
  // Mocked for user ID 1 for demonstration
  try {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri('user@example.com', 'Info-Scope-Minia', secret);
    const qrImageUrl = await qrcode.toDataURL(otpauth);
    res.json({ secret, qrImageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate 2FA' });
  }
});

// 3. Socket.io for Real-time Sync
io.on('connection', (socket) => {
  console.log('Device connected:', socket.id);
  
  socket.on('sync_progress', (data) => {
    // Broadcast progress to user's other devices
    socket.broadcast.emit('progress_updated', data);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
