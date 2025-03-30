import express from 'express';
import { sequelize, DataTypes } from '../models/index.js'; // ✅ Import sequelize instance
import MessageModel from '../models/Message.js';  // ✅ Import the Message model function
import { authenticateToken } from '../middleware/auth.js';

const Message = MessageModel(sequelize, DataTypes); // ✅ Initialize the model

const router = express.Router();

// 📤 **Send Message**
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const senderId = req.user.userId; // Extract from JWT

    if (!chatId || !content) {
      return res.status(400).json({ error: 'chatId and content are required.' });
    }

    const message = await Message.create({ chatId, senderId, content });

    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// 📜 **Get Messages in a Chat**
router.get('/:chatId', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.findAll({ 
      where: { chatId }, 
      order: [['createdAt', 'ASC']] 
    });

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ✏️ **Edit a Message**
router.put('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const senderId = req.user.userId;

    const message = await Message.findByPk(messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    if (message.senderId !== senderId) return res.status(403).json({ error: 'Unauthorized' });

    message.content = content;
    await message.save();

    res.json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to edit message' });
  }
});

// ❌ **Delete a Message**
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const senderId = req.user.userId;

    const message = await Message.findByPk(messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    if (message.senderId !== senderId) return res.status(403).json({ error: 'Unauthorized' });

    await message.destroy();

    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ✅ **Mark Message as Read**
router.put('/:messageId/read', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByPk(messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    message.isRead = true;
    await message.save();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

export default router;
