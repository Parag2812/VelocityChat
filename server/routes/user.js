import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js'; // Named import from index.js

import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
import { Op } from 'sequelize';





// POST /api/users/register
router.post('/register', async (req, res) => {
    try {
      const { name, password, phoneNumber, avatarUrl, city, country } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
         name,  // Fix: Use 'name' instead of 'username'
         password: hashedPassword,
         phoneNumber,
         avatarUrl, 
         city,
         country
      });

      res.status(201).json({ 
        message: 'User registered successfully', 
        user
      });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: error.message || 'Registration failed' });
    }
});


    // POST /api/users/login
    router.post('/login', async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        const user = await User.findOne({ where: { phoneNumber } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ userId: user.id, phoneNumber: user.phoneNumber }, JWT_SECRET, { expiresIn: '12h' });
        res.json({ message: 'Logged in successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
    });


router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
  });

// POST /api/users/resetpassword

router.post('/resetpassword',authenticateToken, async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;
      const user = await User.findOne({ where: { phoneNumber } });
      if (!user) return res.status(401).json({ error: 'User not found with this Phone number.' });
      
        const  hashedPassword = await bcrypt.hash(password,10);
        await user.update({ password: hashedPassword});
        await user.save();

      // const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      const msg  = "Password changed successfully";
      res.json({ msg });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'failed to change password' });
    }
  });


  // /api/users/getuser
  router.get('/getuser', authenticateToken, async (req, res) => {
    try {
      const { phoneNumber, name } = req.query; // Use query params for GET
  
      // Ensure at least one of phoneNumber or name is provided
      if (!phoneNumber && !name) {
        return res.status(400).json({ error: 'Either phoneNumber or name is required.' });
      }
  
      // Dynamically build the where clause
      const whereClause = {};
      if (phoneNumber) whereClause.phoneNumber = phoneNumber;
      if (name) whereClause.name = { [Op.iLike]: `%${name}%` }; // Case-insensitive LIKE search
  
      const user = await User.findAll({ where: whereClause });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  });
  

export default router;
