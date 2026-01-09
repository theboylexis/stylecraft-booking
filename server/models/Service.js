import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number,
        required: true,
        min: 10
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
