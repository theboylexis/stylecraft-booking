import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Mail, Clock, Phone, CalendarPlus, LayoutDashboard } from 'lucide-react';
import { businessInfo } from '../../data/mockData';
import Header from '../../components/Header/Header';
import './BookingConfirmation.css';

function BookingConfirmation() {
    const { bookingId } = useParams();

    return (
        <div className="page">
            <Header businessInfo={businessInfo} />

            <main className="page-content">
                <div className="container">
                    <div className="confirmation-wrapper">
                        <div className="confirmation-icon">
                            <CheckCircle size={48} strokeWidth={1.5} />
                        </div>

                        <h1>Booking Confirmed!</h1>
                        <p className="confirmation-message">
                            Your appointment has been successfully booked.
                            We've sent a confirmation email with all the details.
                        </p>

                        <div className="confirmation-id">
                            <span>Booking Reference</span>
                            <strong>#{bookingId}</strong>
                        </div>

                        <div className="confirmation-info card">
                            <h3>What's Next?</h3>
                            <ul>
                                <li>
                                    <Mail size={18} />
                                    <span>Check your email for confirmation details</span>
                                </li>
                                <li>
                                    <Calendar size={18} />
                                    <span>Add the appointment to your calendar</span>
                                </li>
                                <li>
                                    <Clock size={18} />
                                    <span>Arrive 5-10 minutes before your scheduled time</span>
                                </li>
                                <li>
                                    <Phone size={18} />
                                    <span>Contact us if you need to reschedule</span>
                                </li>
                            </ul>
                        </div>

                        <div className="confirmation-actions">
                            <Link to="/" className="btn btn-primary btn-lg">
                                <CalendarPlus size={18} />
                                Book Another Appointment
                            </Link>
                            <Link to="/admin" className="btn btn-secondary">
                                <LayoutDashboard size={16} />
                                View Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default BookingConfirmation;
