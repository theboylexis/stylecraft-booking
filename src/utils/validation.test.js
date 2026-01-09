import { describe, it, expect } from 'vitest';
import {
    isValidEmail,
    isValidPhone,
    isValidName,
    validateBookingForm,
    isStepComplete
} from './validation';

describe('isValidEmail', () => {
    it('returns true for valid emails', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('returns false for invalid emails', () => {
        expect(isValidEmail('invalid')).toBe(false);
        expect(isValidEmail('missing@domain')).toBe(false);
        expect(isValidEmail('@nodomain.com')).toBe(false);
        expect(isValidEmail('')).toBe(false);
    });
});

describe('isValidPhone', () => {
    it('returns true for valid phone numbers', () => {
        expect(isValidPhone('0241234567')).toBe(true);
        expect(isValidPhone('024-123-4567')).toBe(true);
        expect(isValidPhone('+233241234567')).toBe(true);
    });

    it('returns false for too short numbers', () => {
        expect(isValidPhone('12345')).toBe(false);
        expect(isValidPhone('')).toBe(false);
    });
});

describe('isValidName', () => {
    it('returns true for valid names', () => {
        expect(isValidName('John Doe')).toBe(true);
        expect(isValidName('Kofi')).toBe(true);
    });

    it('returns false for too short names', () => {
        expect(isValidName('J')).toBe(false);
        expect(isValidName('')).toBe(false);
    });

    it('returns false for names with numbers', () => {
        expect(isValidName('John123')).toBe(false);
    });
});

describe('validateBookingForm', () => {
    it('returns valid for complete form', () => {
        const result = validateBookingForm({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '0241234567'
        });
        expect(result.isValid).toBe(true);
        expect(Object.keys(result.errors).length).toBe(0);
    });

    it('returns errors for invalid form', () => {
        const result = validateBookingForm({
            name: '',
            email: 'invalid',
            phone: '123'
        });
        expect(result.isValid).toBe(false);
        expect(result.errors.name).toBeDefined();
        expect(result.errors.email).toBeDefined();
        expect(result.errors.phone).toBeDefined();
    });
});

describe('isStepComplete', () => {
    it('step 1: requires serviceId', () => {
        expect(isStepComplete(1, { serviceId: null })).toBe(false);
        expect(isStepComplete(1, { serviceId: 1 })).toBe(true);
    });

    it('step 2: requires date and time', () => {
        expect(isStepComplete(2, { date: null, time: null })).toBe(false);
        expect(isStepComplete(2, { date: new Date(), time: '10:00' })).toBe(true);
    });

    it('step 3: requires client details', () => {
        expect(isStepComplete(3, { name: '', email: '', phone: '' })).toBe(false);
        expect(isStepComplete(3, { name: 'John', email: 'j@x.com', phone: '123' })).toBe(true);
    });

    it('step 4: always complete', () => {
        expect(isStepComplete(4, {})).toBe(true);
    });
});
