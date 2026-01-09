import nodemailer from 'nodemailer';

// Create transporter (using Gmail SMTP - configure your own credentials)
const createTransporter = () => {
    // For development, use Ethereal fake SMTP
    // For production, replace with your actual email service
    if (process.env.NODE_ENV === 'production' && process.env.EMAIL_USER) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    // Development: log emails to console
    return null;
};

/**
 * Send booking confirmation email
 */
export const sendBookingConfirmation = async (booking, service) => {
    const transporter = createTransporter();

    const emailContent = {
        to: booking.clientEmail,
        subject: `Booking Confirmed - ${service.name} at StyleCraft Studio`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #4f46e5; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">Booking Confirmed!</h1>
                </div>
                
                <div style="padding: 30px; background: #f9fafb;">
                    <p>Hi <strong>${booking.clientName}</strong>,</p>
                    <p>Your appointment has been confirmed at StyleCraft Studio.</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #4f46e5;">Appointment Details</h3>
                        <p><strong>Service:</strong> ${service.name}</p>
                        <p><strong>Date:</strong> ${booking.date}</p>
                        <p><strong>Time:</strong> ${booking.time}</p>
                        <p><strong>Duration:</strong> ${service.duration} minutes</p>
                        <p><strong>Price:</strong> ₵${service.price}</p>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px;">
                        <strong>Booking Reference:</strong> ${booking._id}
                    </p>
                    
                    <p>If you need to reschedule or cancel, please contact us.</p>
                    
                    <p style="margin-top: 30px;">
                        Thank you for choosing StyleCraft Studio!<br>
                        <strong>East Legon, Accra</strong>
                    </p>
                </div>
                
                <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                    This is an automated message. Please do not reply directly.
                </div>
            </div>
        `
    };

    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"StyleCraft Studio" <${process.env.EMAIL_USER}>`,
                ...emailContent
            });
            console.log(`✉️ Confirmation email sent to ${booking.clientEmail}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    } else {
        // Development: log email to console
        console.log('📧 [DEV] Email would be sent:');
        console.log(`   To: ${emailContent.to}`);
        console.log(`   Subject: ${emailContent.subject}`);
    }
};

/**
 * Send booking cancellation email
 */
export const sendBookingCancellation = async (booking, service) => {
    const transporter = createTransporter();

    const emailContent = {
        to: booking.clientEmail,
        subject: `Booking Cancelled - StyleCraft Studio`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #ef4444; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">Booking Cancelled</h1>
                </div>
                
                <div style="padding: 30px; background: #f9fafb;">
                    <p>Hi <strong>${booking.clientName}</strong>,</p>
                    <p>Your appointment has been cancelled.</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Cancelled Appointment</h3>
                        <p><strong>Service:</strong> ${service?.name || 'N/A'}</p>
                        <p><strong>Date:</strong> ${booking.date}</p>
                        <p><strong>Time:</strong> ${booking.time}</p>
                    </div>
                    
                    <p>We'd love to see you again! Book a new appointment anytime.</p>
                    
                    <p style="margin-top: 30px;">
                        Best regards,<br>
                        <strong>StyleCraft Studio</strong>
                    </p>
                </div>
            </div>
        `
    };

    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"StyleCraft Studio" <${process.env.EMAIL_USER}>`,
                ...emailContent
            });
            console.log(`✉️ Cancellation email sent to ${booking.clientEmail}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    } else {
        console.log('📧 [DEV] Cancellation email would be sent to:', booking.clientEmail);
    }
};
