import express from 'express';
import Admin from '../models/Admin.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register - Register new admin
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Create admin
        const admin = new Admin({ email, password, name });
        await admin.save();

        // Generate token
        const token = generateToken(admin._id);

        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST /api/auth/login - Login admin
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(admin._id);

        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/auth/me - Get current admin
router.get('/me', protect, async (req, res) => {
    res.json(req.admin);
});

export default router;
