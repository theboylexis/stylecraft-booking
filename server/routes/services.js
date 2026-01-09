import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// GET /api/services - Get all active services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({ isActive: true }).sort('name');
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/services - Create a new service (admin)
router.post('/', async (req, res) => {
    try {
        const service = new Service(req.body);
        const saved = await service.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST /api/services/seed - Seed initial services
router.post('/seed', async (req, res) => {
    try {
        const count = await Service.countDocuments();
        if (count > 0) {
            return res.json({ message: 'Services already seeded', count });
        }

        const services = [
            { name: 'Haircut', duration: 30, price: 35, description: 'Professional haircut and styling' },
            { name: 'Hair Coloring', duration: 90, price: 180, description: 'Full hair coloring service' },
            { name: 'Beard Trim', duration: 20, price: 20, description: 'Beard shaping and trimming' },
            { name: 'Full Styling', duration: 60, price: 80, description: 'Haircut, wash, and styling' },
            { name: 'Hair Treatment', duration: 45, price: 100, description: 'Deep conditioning treatment' }
        ];

        const created = await Service.insertMany(services);
        res.status(201).json({ message: 'Services seeded', services: created });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
