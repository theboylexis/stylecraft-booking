// ============================================
// VALIDATION UTILITIES
// ============================================
// YOU WILL WRITE THESE FUNCTIONS!

/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid email format
 * 
 * HINT: Use a regex pattern. A simple one:
 * /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 * This checks: something@something.something
 */
export const isValidEmail = (email) => {
    // TODO: Implement this function
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate a phone number (basic validation)
 * @param {string} phone - The phone number
 * @returns {boolean} - True if valid phone format
 * 
 * HINT: Remove all non-digit characters, then check length
 * A valid phone typically has 10-15 digits
 */
export const isValidPhone = (phone) => {
    // Remove non-digits first, then check length
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

/**
 * Validate a name (at least 2 characters, letters and spaces only)
 * @param {string} name - The name to validate
 * @returns {boolean} - True if valid name
 * 
 * HINT: Check length >= 2 and use regex /^[a-zA-Z\s]+$/
 */
export const isValidName = (name) => {
    if (!name || name.trim().length < 2) return false;
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name.trim());
};

/**
 * Validate the booking form data
 * @param {Object} formData - The form data object
 * @param {string} formData.name - Client name
 * @param {string} formData.email - Client email
 * @param {string} formData.phone - Client phone
 * @returns {Object} - { isValid: boolean, errors: { field: message } }
 * 
 * HINT: Use the above validation functions
 * Build an errors object with field names as keys
 */
export const validateBookingForm = (formData) => {
    // TODO: Implement this function
    const errors = {};
    if (!isValidName(formData.name)) {
        errors.name = 'Invalid name';
    }
    if (!isValidEmail(formData.email)) {
        errors.email = 'Invalid email';
    }
    if (!isValidPhone(formData.phone)) {
        errors.phone = 'Invalid phone';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Check if booking step is complete
 * @param {number} step - Current step number (1-4)
 * @param {Object} bookingData - Current booking state
 * @returns {boolean} - True if the step is complete
 * 
 * Step 1: Service selected (serviceId exists)
 * Step 2: Date and time selected
 * Step 3: Client details filled and valid
 * Step 4: Always complete (confirmation step)
 */
export const isStepComplete = (step, bookingData) => {
    // TODO: Implement this function
    switch (step) {
        case 1:
            return bookingData.serviceId !== null;
        case 2:
            return bookingData.date !== null && bookingData.time !== null;
        case 3:
            return bookingData.name !== '' && bookingData.email !== '' && bookingData.phone !== '';
        case 4:
            return true;
    }
};
