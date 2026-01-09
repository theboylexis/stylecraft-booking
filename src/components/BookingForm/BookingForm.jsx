import { User, Mail, Phone, MessageSquare } from 'lucide-react';
import './BookingForm.css';

function BookingForm({ formData, onChange }) {
    return (
        <div className="booking-form card">
            <div className="card-header">
                <h3 className="card-title">Contact Information</h3>
                <p className="card-description">We'll send your booking confirmation here</p>
            </div>

            <div className="form-group">
                <label htmlFor="clientName" className="form-label">
                    Full Name
                </label>
                <div className="input-with-icon">
                    <User size={16} className="input-icon" />
                    <input
                        type="text"
                        id="clientName"
                        name="clientName"
                        className="form-input"
                        placeholder="Kofi Mensah"
                        value={formData.clientName}
                        onChange={onChange}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="clientEmail" className="form-label">
                    Email Address
                </label>
                <div className="input-with-icon">
                    <Mail size={16} className="input-icon" />
                    <input
                        type="email"
                        id="clientEmail"
                        name="clientEmail"
                        className="form-input"
                        placeholder="kofi@example.com"
                        value={formData.clientEmail}
                        onChange={onChange}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="clientPhone" className="form-label">
                    Phone Number
                </label>
                <div className="input-with-icon">
                    <Phone size={16} className="input-icon" />
                    <input
                        type="tel"
                        id="clientPhone"
                        name="clientPhone"
                        className="form-input"
                        placeholder="024-123-4567"
                        value={formData.clientPhone}
                        onChange={onChange}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="notes" className="form-label">
                    Additional Notes <span className="text-muted">(optional)</span>
                </label>
                <div className="input-with-icon textarea-wrapper">
                    <MessageSquare size={16} className="input-icon" />
                    <textarea
                        id="notes"
                        name="notes"
                        className="form-textarea"
                        placeholder="Any special requests..."
                        value={formData.notes}
                        onChange={onChange}
                        rows={3}
                    />
                </div>
            </div>
        </div>
    );
}

export default BookingForm;
