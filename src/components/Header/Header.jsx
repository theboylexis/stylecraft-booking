import { Link } from 'react-router-dom';
import { Calendar, LayoutDashboard } from 'lucide-react';
import './Header.css';

function Header({ businessInfo, isAdmin = false }) {
    return (
        <header className="page-header">
            <div className="container">
                <nav className="nav">
                    <Link to="/" className="nav-brand">
                        <div className="nav-brand-icon">
                            <Calendar size={20} strokeWidth={2.5} />
                        </div>
                        {businessInfo.name}
                    </Link>

                    <div className="nav-links">
                        <Link to="/" className={`nav-link ${!isAdmin ? 'active' : ''}`}>
                            <Calendar size={16} />
                            Book Now
                        </Link>
                        <Link to="/admin" className={`nav-link ${isAdmin ? 'active' : ''}`}>
                            <LayoutDashboard size={16} />
                            Dashboard
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;
