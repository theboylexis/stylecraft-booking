// ============================================
// DATE/TIME UTILITIES
// ============================================
// YOU WILL WRITE THESE FUNCTIONS!
// I've provided the function signatures and descriptions.
// Your job is to implement the logic.

/**
 * Format a date object to YYYY-MM-DD string
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string (e.g., "2026-01-15")
 * 
 * HINT: Use date.getFullYear(), date.getMonth() + 1, date.getDate()
 * Remember to pad single digits with leading zeros!
 */
export const formatDate = (date) => {
    // TODO: Implement this function
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Format a 24-hour time string to 12-hour format with AM/PM
 * @param {string} time24 - Time in 24-hour format (e.g., "14:30")
 * @returns {string} - Time in 12-hour format (e.g., "2:30 PM")
 * 
 * HINT: Split the string by ":", convert hours to number
 * If hours >= 12, it's PM. If hours > 12, subtract 12.
 * Handle edge case: 0 hours should become 12 AM
 */
export const formatTime = (time24) => {
    // TODO: Implement this function
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${String(minutes).padStart(2, '0')} ${period}`;
};

/**
 * Get the name of the day from a date
 * @param {Date} date - The date
 * @returns {string} - Lowercase day name (e.g., "monday", "tuesday")
 * 
 * HINT: Create an array of day names and use date.getDay() as index
 * Note: getDay() returns 0 for Sunday, 1 for Monday, etc.
 */
export const getDayName = (date) => {
    // TODO: Implement this function
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
};

/**
 * Check if a date is in the past (before today)
 * @param {Date} date - The date to check
 * @returns {boolean} - True if date is in the past
 * 
 * HINT: Compare with new Date() but set hours to 0 for both
 * to compare just the date portion
 */
export const isPastDate = (date) => {
    // TODO: Implement this function
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
};

/**
 * Check if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} - True if date is today
 * 
 * HINT: Compare year, month, and day with new Date()
 */
export const isToday = (date) => {
    // TODO: Implement this function
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();
};

/**
 * Get all dates in a month as an array
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {Array} - Array of Date objects for each day
 * 
 * HINT: 
 * 1. Get the number of days in the month using new Date(year, month + 1, 0).getDate()
 * 2. Loop from 1 to daysInMonth and create Date objects
 */
export const getDaysInMonth = (year, month) => {
    // TODO: Implement this function
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = [];
    for (let day = 1; day <= daysInMonth; day++) {
        dates.push(new Date(year, month, day));
    }
    return dates;
};

/**
 * Get the day of week the month starts on (0 = Sunday, 6 = Saturday)
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {number} - Day of week (0-6)
 * 
 * HINT: Create a Date for the first day of the month and use getDay()
 */
export const getMonthStartDay = (year, month) => {
    // TODO: Implement this function
    const date = new Date(year, month, 1);
    return date.getDay();
};

/**
 * Generate time slots for a day based on business hours
 * @param {string} openTime - Opening time (e.g., "09:00")
 * @param {string} closeTime - Closing time (e.g., "18:00")
 * @param {number} interval - Slot interval in minutes (e.g., 30)
 * @returns {Array<string>} - Array of time slots (e.g., ["09:00", "09:30", "10:00", ...])
 * 
 * HINT:
 * 1. Parse openTime and closeTime to get hours and minutes
 * 2. Convert to total minutes from midnight (hours * 60 + minutes)
 * 3. Loop from open to close, incrementing by interval
 * 4. Convert back to "HH:MM" format
 */
export const generateTimeSlots = (openTime, closeTime, interval) => {
    // TODO: Implement this function
    const [openHours, openMinutes] = openTime.split(':').map(Number);
    const [closeHours, closeMinutes] = closeTime.split(':').map(Number);
    const openTotalMinutes = openHours * 60 + openMinutes;
    const closeTotalMinutes = closeHours * 60 + closeMinutes;
    const slots = [];
    for (let minutes = openTotalMinutes; minutes < closeTotalMinutes; minutes += interval) {
        const hours = Math.floor(minutes / 60);
        const minutesRemaining = minutes % 60;
        slots.push(`${String(hours).padStart(2, '0')}:${String(minutesRemaining).padStart(2, '0')}`);
    }
    return slots;
};

/**
 * Check if a time slot is available (not already booked)
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {string} time - Time string (HH:MM)
 * @param {number} duration - Service duration in minutes
 * @param {Array} existingBookings - Array of existing booking objects
 * @param {Array} services - Array of service objects (to get durations)
 * @returns {boolean} - True if the slot is available
 * 
 * HINT: This is a complex one!
 * 1. Filter bookings that match the date
 * 2. For each booking, calculate its end time (start + service duration)
 * 3. Check if the new slot would overlap with any existing booking
 * 4. Two time ranges overlap if: start1 < end2 AND start2 < end1
 */
export const isSlotAvailable = (date, time, duration, existingBookings, services) => {
    // Convert the new slot's time to minutes
    const [hours, minutes] = time.split(':').map(Number);
    const slotStart = hours * 60 + minutes;
    const slotEnd = slotStart + duration;

    // Check each existing booking for overlap
    return existingBookings.every(booking => {
        // Only check bookings on the same date
        if (booking.date !== date) return true;

        // Get the existing booking's time range
        const [bookingHour, bookingMin] = booking.time.split(':').map(Number);
        const bookingStart = bookingHour * 60 + bookingMin;

        // Get duration from services array using booking's serviceId
        const bookingService = services.find(s => s.id === booking.serviceId);
        const bookingDuration = bookingService?.duration || 30;
        const bookingEnd = bookingStart + bookingDuration;

        // No overlap if: new slot ends before booking starts OR new slot starts after booking ends
        return slotEnd <= bookingStart || slotStart >= bookingEnd;
    });
};

/**
 * Get available time slots for a specific date and service
 * @param {Date} date - The selected date
 * @param {number} serviceId - The selected service ID
 * @param {Array} existingBookings - Array of existing bookings
 * @param {Object} businessHours - Business hours configuration
 * @param {Array} services - Array of services
 * @param {number} interval - Time slot interval
 * @returns {Array} - Array of { time, available } objects
 * 
 * This function combines several of the above utilities.
 * I'll provide more guidance when you implement this.
 */
export const getAvailableSlots = (date, serviceId, existingBookings, businessHours, services, interval) => {
    // TODO: Implement this function
    const timeSlots = generateTimeSlots(businessHours.openTime, businessHours.closeTime, interval);
    const availableSlots = timeSlots.map(time => ({
        time,
        available: isSlotAvailable(date, time, services.find(service => service.id === serviceId)?.duration || 0, existingBookings, services)
    }));
    return availableSlots;
};
