// API Service for connecting to the backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================
// SERVICES API
// ============================================

export const getServices = async () => {
    const response = await fetch(`${API_URL}/services`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
};

export const seedServices = async () => {
    const response = await fetch(`${API_URL}/services/seed`, {
        method: 'POST'
    });
    return response.json();
};

// ============================================
// BOOKINGS API
// ============================================

export const getBookings = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/bookings?${params}`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
};

export const getBooking = async (id) => {
    const response = await fetch(`${API_URL}/bookings/${id}`);
    if (!response.ok) throw new Error('Booking not found');
    return response.json();
};

export const createBooking = async (bookingData) => {
    const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create booking');
    }
    return response.json();
};

export const updateBookingStatus = async (id, status) => {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update booking');
    return response.json();
};

export const deleteBooking = async (id) => {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete booking');
    return response.json();
};

// ============================================
// HEALTH CHECK
// ============================================

export const checkHealth = async () => {
    try {
        const response = await fetch(`${API_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
};
