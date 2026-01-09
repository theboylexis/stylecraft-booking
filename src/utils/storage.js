// ============================================
// STORAGE UTILITIES
// ============================================
// Handles saving/loading data from localStorage

const STORAGE_KEYS = {
    BOOKINGS: 'stylecraft_bookings'
};

/**
 * Save bookings to localStorage
 * @param {Array} bookings - Array of booking objects
 */
export const saveBookings = (bookings) => {
    try {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (error) {
        console.error('Error saving bookings:', error);
    }
};

/**
 * Load bookings from localStorage
 * @param {Array} defaultBookings - Default bookings if none saved
 * @returns {Array} - Array of booking objects
 */
export const loadBookings = (defaultBookings = []) => {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
        if (saved) {
            return JSON.parse(saved);
        }
        return defaultBookings;
    } catch (error) {
        console.error('Error loading bookings:', error);
        return defaultBookings;
    }
};

/**
 * Add a new booking
 * @param {Object} booking - Booking object to add
 * @returns {Array} - Updated bookings array
 */
export const addBooking = (booking) => {
    const bookings = loadBookings();
    const newBooking = {
        ...booking,
        id: Date.now(),
        createdAt: new Date().toISOString()
    };
    const updated = [...bookings, newBooking];
    saveBookings(updated);
    return updated;
};

/**
 * Update a booking's status
 * @param {number} bookingId - ID of booking to update
 * @param {string} status - New status ('confirmed', 'cancelled', 'pending')
 * @returns {Array} - Updated bookings array
 */
export const updateBookingStatus = (bookingId, status) => {
    const bookings = loadBookings();
    const updated = bookings.map(b =>
        b.id === bookingId ? { ...b, status } : b
    );
    saveBookings(updated);
    return updated;
};

/**
 * Clear all bookings (useful for testing)
 */
export const clearBookings = () => {
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
};
