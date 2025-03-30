import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
console.log("*****************auth**********************")
    if (!authHeader) {
        console.log("No Authorization header found");
        return res.status(401).json({ error: 'Token required' });
    }

    const tokenParts = authHeader.split(' ');

    // Check if the token is in "Bearer <token>" format
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        console.log("Invalid token format:", authHeader);
        return res.status(401).json({ error: 'Invalid token format' });
    }

    const token = tokenParts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT Payload:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Verification Failed:", err);
        return res.status(403).json({ error: 'Invalid token' });
    }
    console.log("*****************auth**********************")
};
