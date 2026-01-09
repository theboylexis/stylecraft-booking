// Mock data for the booking system
// This simulates a backend database

export const services = [
    {
        id: 1,
        name: 'Haircut',
        duration: 30, // minutes
        price: 35,
        description: 'Professional haircut and styling'
    },
    {
        id: 2,
        name: 'Hair Coloring',
        duration: 90,
        price: 180,
        description: 'Full hair coloring service'
    },
    {
        id: 3,
        name: 'Beard Trim',
        duration: 20,
        price: 20,
        description: 'Beard shaping and trimming'
    },
    {
        id: 4,
        name: 'Full Styling',
        duration: 60,
        price: 80,
        description: 'Haircut, wash, and styling'
    },
    {
        id: 5,
        name: 'Hair Treatment',
        duration: 45,
        price: 100,
        description: 'Deep conditioning treatment'
    }
];

// Business hours configuration
export const businessHours = {
    monday: { open: '09:00', close: '18:00', isOpen: true },
    tuesday: { open: '09:00', close: '18:00', isOpen: true },
    wednesday: { open: '09:00', close: '18:00', isOpen: true },
    thursday: { open: '09:00', close: '20:00', isOpen: true },
    friday: { open: '09:00', close: '20:00', isOpen: true },
    saturday: { open: '10:00', close: '16:00', isOpen: true },
    sunday: { open: '00:00', close: '00:00', isOpen: false }
};

// Time slot interval in minutes
export const timeSlotInterval = 30;

// Currency configuration
export const currency = {
    code: 'GHS',
    symbol: '₵',
    name: 'Ghana Cedis'
};

// Format price with currency
export const formatPrice = (amount) => {
    return `${currency.symbol}${amount.toLocaleString()}`;
};

// Sample existing bookings
export const initialBookings = [
    {
        id: 1,
        serviceId: 1,
        clientName: 'Kofi Mensah',
        clientEmail: 'kofi@example.com',
        clientPhone: '024-123-4567',
        date: '2026-01-10',
        time: '10:00',
        status: 'confirmed',
        createdAt: '2026-01-08T14:30:00Z'
    },
    {
        id: 2,
        serviceId: 4,
        clientName: 'Ama Serwaa',
        clientEmail: 'ama@example.com',
        clientPhone: '055-987-6543',
        date: '2026-01-10',
        time: '14:00',
        status: 'confirmed',
        createdAt: '2026-01-07T09:15:00Z'
    },
    {
        id: 3,
        serviceId: 2,
        clientName: 'Kwame Asante',
        clientEmail: 'kwame@example.com',
        clientPhone: '020-555-1234',
        date: '2026-01-11',
        time: '11:00',
        status: 'pending',
        createdAt: '2026-01-09T16:45:00Z'
    }
];

// Business info
export const businessInfo = {
    name: 'StyleCraft Studio',
    tagline: 'Premium Grooming Experience',
    address: 'East Legon, Accra',
    phone: '030-123-4567',
    email: 'hello@stylecraft.com'
};
