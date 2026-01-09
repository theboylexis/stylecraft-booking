import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    clientEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    clientPhone: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,  // YYYY-MM-DD format
        required: true
    },
    time: {
        type: String,  // HH:MM format
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Index for efficient date queries
bookingSchema.index({ date: 1, time: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
