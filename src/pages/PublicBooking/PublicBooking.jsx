import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Calendar, Sparkles, Loader } from 'lucide-react';
import { businessInfo, businessHours, timeSlotInterval } from '../../data/mockData';
import { getServices, getBookings, createBooking } from '../../services/api';
import Header from '../../components/Header/Header';
import ServiceSelector from '../../components/ServiceSelector/ServiceSelector';
import CalendarComponent from '../../components/Calendar/Calendar';
import TimeSlotPicker from '../../components/TimeSlotPicker/TimeSlotPicker';
import BookingForm from '../../components/BookingForm/BookingForm';
import BookingSummary from '../../components/BookingSummary/BookingSummary';
import StepsIndicator from '../../components/StepsIndicator/StepsIndicator';
import './PublicBooking.css';

function PublicBooking() {
    const [currentStep, setCurrentStep] = useState(1);
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [bookingData, setBookingData] = useState({
        serviceId: null,
        date: null,
        time: null,
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        notes: ''
    });

    // Load services and bookings on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [servicesData, bookingsData] = await Promise.all([
                    getServices(),
                    getBookings()
                ]);
                setServices(servicesData);
                // Transform bookings to match expected format
                setBookings(bookingsData.map(b => ({
                    ...b,
                    id: b._id,
                    serviceId: b.serviceId?._id || b.serviceId
                })));
            } catch (err) {
                setError('Failed to load data. Is the server running?');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleNextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleServiceSelect = (serviceId) => {
        setBookingData(prev => ({ ...prev, serviceId }));
    };

    const handleDateSelect = (date) => {
        setBookingData(prev => ({ ...prev, date, time: null }));
    };

    const handleTimeSelect = (time) => {
        setBookingData(prev => ({ ...prev, time }));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitBooking = async () => {
        try {
            setSubmitting(true);
            const newBooking = await createBooking({
                serviceId: bookingData.serviceId,
                clientName: bookingData.clientName,
                clientEmail: bookingData.clientEmail,
                clientPhone: bookingData.clientPhone,
                date: bookingData.date?.toISOString().split('T')[0],
                time: bookingData.time,
                notes: bookingData.notes
            });

            window.location.href = `/confirmation/${newBooking._id}`;
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    };

    const selectedService = services.find(s => s._id === bookingData.serviceId || s.id === bookingData.serviceId);

    if (loading) {
        return (
            <div className="page">
                <Header businessInfo={businessInfo} />
                <main className="page-content">
                    <div className="container">
                        <div className="loading-state">
                            <Loader className="spinning" size={32} />
                            <p>Loading...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="page">
            <Header businessInfo={businessInfo} />

            <main className="page-content">
                <div className="container">
                    <div className="booking-wrapper">
                        {error && (
                            <div className="error-banner">
                                {error}
                                <button onClick={() => setError(null)}>×</button>
                            </div>
                        )}

                        {/* Page Title */}
                        <div className="booking-header">
                            <div className="booking-header-badge">
                                <Sparkles size={14} />
                                Premium Booking Experience
                            </div>
                            <h1>Book Your Appointment</h1>
                            <p className="text-muted">Select a service and choose your preferred time slot</p>
                        </div>

                        {/* Steps Indicator */}
                        <StepsIndicator currentStep={currentStep} />

                        {/* Step Content */}
                        <div className="booking-content">
                            {/* Step 1: Select Service */}
                            {currentStep === 1 && (
                                <div className="step-content fade-in">
                                    <h2>Choose a Service</h2>
                                    <ServiceSelector
                                        services={services.map(s => ({ ...s, id: s._id || s.id }))}
                                        selectedId={bookingData.serviceId}
                                        onSelect={handleServiceSelect}
                                    />

                                    <div className="step-actions">
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={handleNextStep}
                                            disabled={!bookingData.serviceId}
                                        >
                                            Continue
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Select Date & Time */}
                            {currentStep === 2 && (
                                <div className="step-content fade-in">
                                    <h2>Choose Date & Time</h2>

                                    <div className="datetime-grid">
                                        <div className="calendar-section">
                                            <h3>Select a Date</h3>
                                            <CalendarComponent
                                                selectedDate={bookingData.date}
                                                onDateSelect={handleDateSelect}
                                                bookings={bookings}
                                            />
                                        </div>

                                        <div className="timeslots-section">
                                            <h3>Select a Time</h3>
                                            {bookingData.date ? (
                                                <TimeSlotPicker
                                                    date={bookingData.date}
                                                    selectedTime={bookingData.time}
                                                    onTimeSelect={handleTimeSelect}
                                                    serviceId={bookingData.serviceId}
                                                    bookings={bookings}
                                                    businessHours={businessHours}
                                                    services={services.map(s => ({ ...s, id: s._id || s.id }))}
                                                    interval={timeSlotInterval}
                                                />
                                            ) : (
                                                <div className="empty-state">
                                                    <div className="empty-state-icon">
                                                        <Calendar size={32} strokeWidth={1.5} />
                                                    </div>
                                                    <p className="empty-state-title">Select a date first</p>
                                                    <p className="empty-state-description">
                                                        Choose a date from the calendar to see available time slots
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="step-actions">
                                        <button className="btn btn-secondary" onClick={handlePrevStep}>
                                            <ArrowLeft size={18} />
                                            Back
                                        </button>
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={handleNextStep}
                                            disabled={!bookingData.date || !bookingData.time}
                                        >
                                            Continue
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Your Details */}
                            {currentStep === 3 && (
                                <div className="step-content fade-in">
                                    <h2>Your Details</h2>

                                    <div className="details-grid">
                                        <BookingForm
                                            formData={bookingData}
                                            onChange={handleFormChange}
                                        />

                                        <BookingSummary
                                            service={selectedService}
                                            date={bookingData.date}
                                            time={bookingData.time}
                                        />
                                    </div>

                                    <div className="step-actions">
                                        <button className="btn btn-secondary" onClick={handlePrevStep}>
                                            <ArrowLeft size={18} />
                                            Back
                                        </button>
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={handleNextStep}
                                            disabled={!bookingData.clientName || !bookingData.clientEmail || !bookingData.clientPhone}
                                        >
                                            Review Booking
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Confirm */}
                            {currentStep === 4 && (
                                <div className="step-content fade-in">
                                    <h2>Confirm Your Booking</h2>

                                    <div className="confirmation-card card">
                                        <BookingSummary
                                            service={selectedService}
                                            date={bookingData.date}
                                            time={bookingData.time}
                                            clientName={bookingData.clientName}
                                            clientEmail={bookingData.clientEmail}
                                            clientPhone={bookingData.clientPhone}
                                            notes={bookingData.notes}
                                            showClientInfo={true}
                                        />
                                    </div>

                                    <div className="step-actions">
                                        <button className="btn btn-secondary" onClick={handlePrevStep} disabled={submitting}>
                                            <ArrowLeft size={18} />
                                            Back
                                        </button>
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={handleSubmitBooking}
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader size={18} className="spinning" />
                                                    Booking...
                                                </>
                                            ) : (
                                                <>
                                                    Confirm Booking
                                                    <Sparkles size={18} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PublicBooking;
