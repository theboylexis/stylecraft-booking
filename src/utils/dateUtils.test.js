import { describe, it, expect } from 'vitest';
import {
    formatDate,
    formatTime,
    getDayName,
    isPastDate,
    isToday,
    getDaysInMonth,
    getMonthStartDay,
    generateTimeSlots
} from './dateUtils';

describe('formatDate', () => {
    it('formats a date to YYYY-MM-DD string', () => {
        const date = new Date(2026, 0, 15); // January 15, 2026
        expect(formatDate(date)).toBe('2026-01-15');
    });

    it('pads single digit months and days', () => {
        const date = new Date(2026, 5, 9); // June 9, 2026
        expect(formatDate(date)).toBe('2026-06-09');
    });
});

describe('formatTime', () => {
    it('converts 24-hour time to 12-hour format', () => {
        expect(formatTime('14:30')).toBe('2:30 PM');
    });

    it('handles midnight correctly', () => {
        expect(formatTime('00:00')).toBe('12:00 AM');
    });

    it('handles noon correctly', () => {
        expect(formatTime('12:00')).toBe('12:00 PM');
    });

    it('handles morning times', () => {
        expect(formatTime('09:15')).toBe('9:15 AM');
    });

    it('handles evening times', () => {
        expect(formatTime('18:45')).toBe('6:45 PM');
    });
});

describe('getDayName', () => {
    it('returns lowercase day name', () => {
        const monday = new Date(2026, 0, 5); // January 5, 2026 is a Monday
        expect(getDayName(monday)).toBe('monday');
    });

    it('returns sunday for sunday', () => {
        const sunday = new Date(2026, 0, 4); // January 4, 2026 is a Sunday
        expect(getDayName(sunday)).toBe('sunday');
    });
});

describe('isPastDate', () => {
    it('returns true for past dates', () => {
        const pastDate = new Date(2020, 0, 1);
        expect(isPastDate(pastDate)).toBe(true);
    });

    it('returns false for future dates', () => {
        const futureDate = new Date(2030, 0, 1);
        expect(isPastDate(futureDate)).toBe(false);
    });
});

describe('isToday', () => {
    it('returns true for today', () => {
        const today = new Date();
        expect(isToday(today)).toBe(true);
    });

    it('returns false for yesterday', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(isToday(yesterday)).toBe(false);
    });
});

describe('getDaysInMonth', () => {
    it('returns 31 days for January', () => {
        const days = getDaysInMonth(2026, 0); // January
        expect(days.length).toBe(31);
    });

    it('returns 28 days for February (non-leap year)', () => {
        const days = getDaysInMonth(2025, 1); // February 2025
        expect(days.length).toBe(28);
    });

    it('returns 29 days for February (leap year)', () => {
        const days = getDaysInMonth(2024, 1); // February 2024
        expect(days.length).toBe(29);
    });
});

describe('getMonthStartDay', () => {
    it('returns correct day of week for month start', () => {
        // January 1, 2026 is a Thursday (4)
        expect(getMonthStartDay(2026, 0)).toBe(4);
    });
});

describe('generateTimeSlots', () => {
    it('generates correct number of slots', () => {
        const slots = generateTimeSlots('09:00', '12:00', 30);
        // 9:00, 9:30, 10:00, 10:30, 11:00, 11:30 = 6 slots
        expect(slots.length).toBe(6);
    });

    it('generates slots with correct format', () => {
        const slots = generateTimeSlots('09:00', '10:00', 30);
        expect(slots).toEqual(['09:00', '09:30']);
    });

    it('handles hour intervals', () => {
        const slots = generateTimeSlots('09:00', '12:00', 60);
        expect(slots).toEqual(['09:00', '10:00', '11:00']);
    });
});
