import express from 'express';
import models from '../models/index.js'; // Import models correctly
import { authenticateToken } from '../middleware/auth.js';
import { Op } from 'sequelize';
const router = express.Router();
const { Chat, User } = models; // Import User model as well

// Create a new chat
router.post('/', authenticateToken, async (req, res) => {   //checked
 try {
    let { participantOne, participantTwo } = req.body;
    
    if (!participantOne || !participantTwo) {
      return res.status(400).json({ error: 'Both phone numbers are required.' });
    }

    // ✅ Check if both users exist in the Users table
    const userOne = await User.findOne({ where: { id: participantOne } });
    const userTwo = await User.findOne({ where: { id: participantTwo } });

    if (!userOne || !userTwo) {
      return res.status(400).json({ error: 'One or both participants do not exist.' });
    }


    // ✅ Convert UUIDs to phone numbers before inserting into Chats
    participantOne = userOne.phoneNumber;
    participantTwo = userTwo.phoneNumber;


    // ✅ Check if a chat already exists
    let chat = await Chat.findOne({
      where: {
        participantOne,
        participantTwo,
      },
    });

    if (!chat) {
      chat = await Chat.create({ participantOne, participantTwo });
    }

    res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});



// ✅ Get all chats for the logged-in user
// api/chats/getallchats
router.get('/getallchats', authenticateToken, async (req, res) => { //checked
    try {
        console.log("Headers Received:", req.headers);  // Debug log

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        console.log("Decoded User:", req.user);
        const userId = req.user.userId;
        
        const user = await User.findOne({ where: { id: userId } });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const chats = await Chat.findAll({
            where: {
                [Op.or]: [
                    { participantOne: user.phoneNumber },
                    { participantTwo: user.phoneNumber }
                ]
            }
        });

        res.status(200).json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
});


export default router;
