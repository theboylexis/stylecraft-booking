import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, Users, CheckCircle, Calendar, X, Scissors, Loader, LogOut } from 'lucide-react';
import { businessInfo } from '../../data/mockData';
import { getServices, getBookings, updateBookingStatus as updateBookingStatusAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import './AdminDashboard.css';

function AdminDashboard() {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [servicesData, bookingsData] = await Promise.all([
                    getServices(),
                    getBookings()
                ]);
                setServices(servicesData);
                setBookings(bookingsData.map(b => ({
                    ...b,
                    id: b._id,
                    serviceId: b.serviceId?._id || b.serviceId
                })));
            } catch (err) {
                console.error('Failed to load data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const getFilteredBookings = () => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        switch (filter) {
            case 'today':
                return bookings.filter(b => b.date === todayStr);
            case 'upcoming':
                return bookings.filter(b => b.date > todayStr);
            case 'past':
                return bookings.filter(b => b.date < todayStr);
            default:
                return bookings;
        }
    };

    const getStats = () => {
        const today = new Date().toISOString().split('T')[0];

        return {
            today: bookings.filter(b => b.date === today).length,
            upcoming: bookings.filter(b => b.date > today).length,
            total: bookings.length,
            confirmed: bookings.filter(b => b.status === 'confirmed').length
        };
    };

    const handleConfirmBooking = async (bookingId) => {
        try {
            await updateBookingStatusAPI(bookingId, 'confirmed');
            setBookings(prev =>
                prev.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b)
            );
        } catch (err) {
            console.error('Failed to confirm booking:', err);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            await updateBookingStatusAPI(bookingId, 'cancelled');
            setBookings(prev =>
                prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
            );
            setShowCancelModal(false);
            setSelectedBooking(null);
        } catch (err) {
            console.error('Failed to cancel booking:', err);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr + 'T00:00:00');
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatTime = (time24) => {
        const [hour, minute] = time24.split(':').map(Number);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return 'badge-success';
            case 'pending':
                return 'badge-warning';
            case 'cancelled':
                return 'badge-error';
            default:
                return 'badge-default';
        }
    };

    const getServiceById = (serviceId) => {
        return services.find(s => s._id === serviceId || s.id === serviceId);
    };

    const filteredBookings = getFilteredBookings();
    const stats = getStats();

    const statCards = [
        { label: "Today's Bookings", value: stats.today, icon: CalendarDays },
        { label: 'Upcoming', value: stats.upcoming, icon: Clock },
        { label: 'Total Clients', value: stats.total, icon: Users },
        { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle }
    ];

    if (loading) {
        return (
            <div className="page">
                <Header businessInfo={businessInfo} isAdmin={true} />
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
            <Header businessInfo={businessInfo} isAdmin={true} />

            <main className="page-content">
                <div className="container">
                    <div className="admin-header">
                        <div>
                            <h1>Dashboard</h1>
                            <p className="text-muted">Welcome back, {admin?.name || 'Admin'}</p>
                        </div>
                        <button className="btn btn-secondary" onClick={handleLogout}>
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        {statCards.map((stat, index) => {
                            const IconComponent = stat.icon;
                            return (
                                <div key={index} className="stat-card">
                                    <div className="stat-icon">
                                        <IconComponent size={24} strokeWidth={1.5} />
                                    </div>
                                    <div className="stat-label">{stat.label}</div>
                                    <div className="stat-value">{stat.value}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Filter Tabs */}
                    <div className="filter-tabs">
                        {['all', 'today', 'upcoming', 'past'].map(f => (
                            <button
                                key={f}
                                className={`filter-tab ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Bookings List */}
                    <div className="bookings-section">
                        <h2>Appointments</h2>

                        {filteredBookings.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <Calendar size={32} strokeWidth={1.5} />
                                </div>
                                <p className="empty-state-title">No appointments found</p>
                                <p className="empty-state-description">
                                    {filter === 'today'
                                        ? 'You have no appointments scheduled for today.'
                                        : 'No appointments match your current filter.'}
                                </p>
                            </div>
                        ) : (
                            <div className="booking-list">
                                {filteredBookings.map(booking => {
                                    const service = getServiceById(booking.serviceId);

                                    return (
                                        <div key={booking.id} className="booking-item">
                                            <div className="booking-time">
                                                <div className="booking-time-value">
                                                    {formatTime(booking.time).split(' ')[0]}
                                                </div>
                                                <div className="booking-time-period">
                                                    {formatTime(booking.time).split(' ')[1]}
                                                </div>
                                            </div>

                                            <div className="booking-divider" />

                                            <div className="booking-details">
                                                <div className="booking-client">{booking.clientName}</div>
                                                <div className="booking-service">
                                                    <Scissors size={14} />
                                                    {service?.name || 'Unknown'} • {formatDate(booking.date)}
                                                </div>
                                            </div>

                                            <span className={`badge ${getStatusBadge(booking.status)}`}>
                                                {booking.status}
                                            </span>

                                            <div className="booking-actions">
                                                {booking.status === 'pending' && (
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => handleConfirmBooking(booking.id)}
                                                    >
                                                        <CheckCircle size={14} />
                                                        Confirm
                                                    </button>
                                                )}
                                                {booking.status !== 'cancelled' && (
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setShowCancelModal(true);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && selectedBooking && (
                <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Cancel Appointment</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowCancelModal(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to cancel this appointment?</p>
                            <div className="cancel-details">
                                <strong>{selectedBooking.clientName}</strong>
                                <p>{formatDate(selectedBooking.date)} at {formatTime(selectedBooking.time)}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowCancelModal(false)}
                            >
                                Keep Appointment
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleCancelBooking(selectedBooking.id)}
                            >
                                Cancel Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
