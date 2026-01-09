import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Calendar.css';

function Calendar({ selectedDate, onDateSelect, bookings }) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const getDaysInMonth = () => {
        return new Date(currentYear, currentMonth + 1, 0).getDate();
    };

    const getFirstDayOfMonth = () => {
        return new Date(currentYear, currentMonth, 1).getDay();
    };

    const isPast = (day) => {
        const date = new Date(currentYear, currentMonth, day);
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return date < todayStart;
    };

    const isToday = (day) => {
        return (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        );
    };

    const isSelected = (day) => {
        if (!selectedDate) return false;
        return (
            day === selectedDate.getDate() &&
            currentMonth === selectedDate.getMonth() &&
            currentYear === selectedDate.getFullYear()
        );
    };

    const hasBookings = (day) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return bookings.some(booking => booking.date === dateStr);
    };

    const handleDateClick = (day) => {
        if (isPast(day)) return;
        const newDate = new Date(currentYear, currentMonth, day);
        onDateSelect(newDate);
    };

    const daysInMonth = getDaysInMonth();
    const firstDay = getFirstDayOfMonth();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayClasses = [
            'calendar-day',
            isPast(day) ? 'disabled' : '',
            isToday(day) ? 'today' : '',
            isSelected(day) ? 'selected' : '',
            hasBookings(day) ? 'has-bookings' : ''
        ].filter(Boolean).join(' ');

        days.push(
            <div
                key={day}
                className={dayClasses}
                onClick={() => handleDateClick(day)}
                role="button"
                tabIndex={isPast(day) ? -1 : 0}
                onKeyDown={(e) => e.key === 'Enter' && handleDateClick(day)}
            >
                {day}
            </div>
        );
    }

    const canGoPrev = currentYear > today.getFullYear() ||
        (currentYear === today.getFullYear() && currentMonth > today.getMonth());

    return (
        <div className="calendar">
            <div className="calendar-header">
                <h4 className="calendar-title">
                    {monthNames[currentMonth]} {currentYear}
                </h4>
                <div className="calendar-nav">
                    <button
                        className="calendar-nav-btn"
                        onClick={handlePrevMonth}
                        disabled={!canGoPrev}
                        aria-label="Previous month"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        className="calendar-nav-btn"
                        onClick={handleNextMonth}
                        aria-label="Next month"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="calendar-weekdays">
                {weekdays.map(day => (
                    <div key={day} className="calendar-weekday">{day}</div>
                ))}
            </div>

            <div className="calendar-grid">
                {days}
            </div>
        </div>
    );
}

export default Calendar;
