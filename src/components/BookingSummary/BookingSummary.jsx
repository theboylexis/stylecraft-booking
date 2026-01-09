import { Scissors, Calendar, Clock, User, Mail, Phone, FileText } from 'lucide-react';
import { formatPrice } from '../../data/mockData';
import './BookingSummary.css';

function BookingSummary({
    service,
    date,
    time,
    clientName,
    clientEmail,
    clientPhone,
    notes,
    showClientInfo = false
}) {

    const formatDate = (date) => {
        if (!date) return '';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatTime = (time24) => {
        if (!time24) return '';
        const [hour, minute] = time24.split(':').map(Number);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
    };

    return (
        <div className="booking-summary">
            <h3 className="summary-title">Booking Summary</h3>

            {service && (
                <div className="summary-section">
                    <div className="summary-row">
                        <div className="summary-icon-wrapper">
                            <Scissors size={16} />
                        </div>
                        <div className="summary-content">
                            <span className="summary-label">Service</span>
                            <span className="summary-value">{service.name}</span>
                        </div>
                        <span className="summary-price">{formatPrice(service.price)}</span>
                    </div>

                    <div className="summary-meta">
                        <Clock size={12} />
                        <span>{service.duration} minutes</span>
                    </div>
                </div>
            )}

            {date && time && (
                <div className="summary-section">
                    <div className="summary-row">
                        <div className="summary-icon-wrapper">
                            <Calendar size={16} />
                        </div>
                        <div className="summary-content">
                            <span className="summary-label">Appointment</span>
                            <span className="summary-value">{formatDate(date)}</span>
                            <span className="summary-time">{formatTime(time)}</span>
                        </div>
                    </div>
                </div>
            )}

            {showClientInfo && clientName && (
                <div className="summary-section">
                    <div className="summary-row">
                        <div className="summary-icon-wrapper">
                            <User size={16} />
                        </div>
                        <div className="summary-content">
                            <span className="summary-label">Contact</span>
                            <span className="summary-value">{clientName}</span>
                        </div>
                    </div>

                    <div className="summary-contact-details">
                        <div className="contact-item">
                            <Mail size={12} />
                            <span>{clientEmail}</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={12} />
                            <span>{clientPhone}</span>
                        </div>
                    </div>

                    {notes && (
                        <div className="summary-notes">
                            <div className="notes-header">
                                <FileText size={12} />
                                <span>Notes</span>
                            </div>
                            <p>{notes}</p>
                        </div>
                    )}
                </div>
            )}

            {service && (
                <div className="summary-total">
                    <span>Total</span>
                    <span className="total-amount">{formatPrice(service.price)}</span>
                </div>
            )}
        </div>
    );
}

export default BookingSummary;
