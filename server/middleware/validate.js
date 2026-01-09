// Validation middleware for API requests

/**
 * Validate booking creation/update data
 */
export const validateBooking = (req, res, next) => {
    const { clientName, clientEmail, clientPhone, date, time, serviceId } = req.body;
    const errors = [];

    // Required fields
    if (!serviceId) errors.push('Service is required');
    if (!date) errors.push('Date is required');
    if (!time) errors.push('Time is required');
    if (!clientName || clientName.trim().length < 2) {
        errors.push('Valid name is required (at least 2 characters)');
    }

    // Email validation
    if (!clientEmail) {
        errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
        errors.push('Invalid email format');
    }

    // Phone validation (Ghanaian format: 10 digits)
    if (!clientPhone) {
        errors.push('Phone number is required');
    } else {
        const digitsOnly = clientPhone.replace(/\D/g, '');
        if (digitsOnly.length < 10 || digitsOnly.length > 15) {
            errors.push('Invalid phone number (10-15 digits required)');
        }
    }

    // Date format validation (YYYY-MM-DD)
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        errors.push('Invalid date format (use YYYY-MM-DD)');
    }

    // Time format validation (HH:MM)
    if (time && !/^\d{2}:\d{2}$/.test(time)) {
        errors.push('Invalid time format (use HH:MM)');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }

    next();
};

/**
 * Validate service creation data
 */
export const validateService = (req, res, next) => {
    const { name, duration, price } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('Service name is required (at least 2 characters)');
    }

    if (!duration || duration < 10) {
        errors.push('Duration is required (minimum 10 minutes)');
    }

    if (price === undefined || price < 0) {
        errors.push('Price is required (cannot be negative)');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }

    next();
};

/**
 * Validate booking status update
 */
export const validateStatusUpdate = (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Invalid status',
            validOptions: validStatuses
        });
    }

    next();
};
