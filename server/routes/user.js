import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js'; // default import

const { User } = db; // destructure User from the exported object
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/users/register
router.post('/register', async (req, res) => {
    try {
      const { username, password, phoneNumber } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hashedPassword, phoneNumber });
      res.status(201).json({ 
        message: 'User registered successfully', 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });


// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    // const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    const msg  = "Loged";
    res.json({ msg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
