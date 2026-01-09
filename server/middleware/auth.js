import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

/**
 * Protect routes - verify JWT token
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get admin from token
        const admin = await Admin.findById(decoded.id).select('-password');

        if (!admin) {
            return res.status(401).json({ message: 'Not authorized, admin not found' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        res.status(401).json({ message: 'Not authorized, token invalid' });
    }
};

/**
 * Generate JWT token
 */
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};
