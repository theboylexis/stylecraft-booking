import { Scissors, Palette, User, Sparkles, Clock } from 'lucide-react';
import { formatPrice } from '../../data/mockData';
import './ServiceSelector.css';

// Map service names to Lucide icons
const serviceIcons = {
    'Haircut': Scissors,
    'Hair Coloring': Palette,
    'Beard Trim': User,
    'Full Styling': Sparkles,
    'Hair Treatment': Sparkles
};

function ServiceSelector({ services, selectedId, onSelect }) {
    return (
        <div className="services-grid">
            {services.map(service => {
                const IconComponent = serviceIcons[service.name] || Scissors;

                return (
                    <div
                        key={service.id}
                        className={`service-card ${selectedId === service.id ? 'selected' : ''}`}
                        onClick={() => onSelect(service.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onSelect(service.id)}
                    >
                        <div className="service-icon">
                            <IconComponent size={20} strokeWidth={1.5} />
                        </div>
                        <div className="service-info">
                            <div className="service-name">{service.name}</div>
                            <div className="service-duration">
                                <Clock size={12} />
                                {service.duration} min
                            </div>
                        </div>
                        <div className="service-price">{formatPrice(service.price)}</div>
                    </div>
                );
            })}
        </div>
    );
}

export default ServiceSelector;
