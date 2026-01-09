import express from 'express';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { validateBooking, validateStatusUpdate } from '../middleware/validate.js';
import { sendBookingConfirmation, sendBookingCancellation } from '../services/email.js';

const router = express.Router();

// GET /api/bookings - Get all bookings
router.get('/', async (req, res) => {
    try {
        const { date, status } = req.query;
        const filter = {};

        if (date) filter.date = date;
        if (status) filter.status = status;

        const bookings = await Booking.find(filter)
            .populate('serviceId', 'name duration price')
            .sort({ date: 1, time: 1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/bookings/:id - Get single booking
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('serviceId', 'name duration price');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/bookings - Create new booking (with validation + email)
router.post('/', validateBooking, async (req, res) => {
    try {
        const booking = new Booking({
            ...req.body,
            status: 'confirmed'
        });

        const saved = await booking.save();
        const populated = await saved.populate('serviceId', 'name duration price');

        // Send confirmation email (async, don't wait)
        const service = await Service.findById(booking.serviceId);
        if (service) {
            sendBookingConfirmation(populated, service);
        }

        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH /api/bookings/:id - Update booking status (with email for cancellation)
router.patch('/:id', async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('serviceId', 'name duration price');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Send cancellation email if status changed to cancelled
        if (status === 'cancelled') {
            const service = await Service.findById(booking.serviceId);
            sendBookingCancellation(booking, service);
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/bookings/:id - Delete booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
