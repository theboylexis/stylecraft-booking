import { CalendarX, Clock } from 'lucide-react';
import './TimeSlotPicker.css';

function TimeSlotPicker({
    date,
    selectedTime,
    onTimeSelect,
    serviceId,
    bookings,
    businessHours,
    services,
    interval
}) {

    const getDayName = () => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
    };

    const generateTimeSlots = () => {
        const dayName = getDayName();
        const hours = businessHours[dayName];

        if (!hours.isOpen) {
            return [];
        }

        const slots = [];
        const [openHour, openMin] = hours.open.split(':').map(Number);
        const [closeHour, closeMin] = hours.close.split(':').map(Number);
        const openMinutes = openHour * 60 + openMin;
        const closeMinutes = closeHour * 60 + closeMin;

        for (let mins = openMinutes; mins < closeMinutes; mins += interval) {
            const hour = Math.floor(mins / 60);
            const minute = mins % 60;
            const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            slots.push(timeStr);
        }

        return slots;
    };

    const isSlotAvailable = (time) => {
        const dateStr = date.toISOString().split('T')[0];
        const service = services.find(s => s.id === serviceId);
        const duration = service ? service.duration : 30;
        const dateBookings = bookings.filter(b => b.date === dateStr);

        const [slotHour, slotMin] = time.split(':').map(Number);
        const slotStart = slotHour * 60 + slotMin;
        const slotEnd = slotStart + duration;

        for (const booking of dateBookings) {
            const [bookingHour, bookingMin] = booking.time.split(':').map(Number);
            const bookingService = services.find(s => s.id === booking.serviceId);
            const bookingDuration = bookingService ? bookingService.duration : 30;
            const bookingStart = bookingHour * 60 + bookingMin;
            const bookingEnd = bookingStart + bookingDuration;

            if (slotStart < bookingEnd && bookingStart < slotEnd) {
                return false;
            }
        }

        return true;
    };

    const isSlotPast = (time) => {
        const now = new Date();
        const todayDate = new Date();

        if (
            date.getDate() !== todayDate.getDate() ||
            date.getMonth() !== todayDate.getMonth() ||
            date.getFullYear() !== todayDate.getFullYear()
        ) {
            return false;
        }

        const [hour, minute] = time.split(':').map(Number);
        const slotTime = new Date(date);
        slotTime.setHours(hour, minute, 0, 0);

        return slotTime <= now;
    };

    const formatTime = (time24) => {
        const [hour, minute] = time24.split(':').map(Number);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
    };

    const timeSlots = generateTimeSlots();
    const dayName = getDayName();
    const hours = businessHours[dayName];

    if (!hours.isOpen) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">
                    <CalendarX size={32} strokeWidth={1.5} />
                </div>
                <p className="empty-state-title">We're Closed</p>
                <p className="empty-state-description">
                    We're closed on {dayName.charAt(0).toUpperCase() + dayName.slice(1)}s.
                    Please select another date.
                </p>
            </div>
        );
    }

    const availableSlots = timeSlots.filter(time => isSlotAvailable(time) && !isSlotPast(time));

    if (availableSlots.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">
                    <Clock size={32} strokeWidth={1.5} />
                </div>
                <p className="empty-state-title">Fully Booked</p>
                <p className="empty-state-description">
                    No available time slots for this date. Please try another day.
                </p>
            </div>
        );
    }

    return (
        <div className="time-slots">
            {timeSlots.map(time => {
                const available = isSlotAvailable(time) && !isSlotPast(time);

                return (
                    <button
                        key={time}
                        className={`time-slot ${selectedTime === time ? 'selected' : ''} ${!available ? 'disabled' : ''}`}
                        onClick={() => available && onTimeSelect(time)}
                        disabled={!available}
                    >
                        {formatTime(time)}
                    </button>
                );
            })}
        </div>
    );
}

export default TimeSlotPicker;
