import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, User, Loader, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { businessInfo } from '../../data/mockData';
import Header from '../../components/Header/Header';
import './AdminLogin.css';

function AdminLogin() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
            }
            navigate('/admin');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="page">
            <Header businessInfo={businessInfo} />

            <main className="page-content">
                <div className="container">
                    <div className="login-wrapper">
                        <div className="login-card card">
                            <div className="login-header">
                                <div className="login-icon">
                                    <LogIn size={24} />
                                </div>
                                <h1>{isLogin ? 'Admin Login' : 'Create Account'}</h1>
                                <p className="text-muted">
                                    {isLogin
                                        ? 'Sign in to access the dashboard'
                                        : 'Register a new admin account'}
                                </p>
                            </div>

                            {error && (
                                <div className="error-banner">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {!isLogin && (
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <div className="input-with-icon">
                                            <User size={16} className="input-icon" />
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-input"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required={!isLogin}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <div className="input-with-icon">
                                        <Mail size={16} className="input-icon" />
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-input"
                                            placeholder="admin@stylecraft.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <div className="input-with-icon">
                                        <Lock size={16} className="input-icon" />
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-input"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg btn-block"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader size={18} className="spinning" />
                                            {isLogin ? 'Signing in...' : 'Creating account...'}
                                        </>
                                    ) : (
                                        <>
                                            {isLogin ? 'Sign In' : 'Create Account'}
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="login-footer">
                                <button
                                    type="button"
                                    className="link-button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                    }}
                                >
                                    {isLogin
                                        ? "Don't have an account? Register"
                                        : 'Already have an account? Sign in'}
                                </button>
                            </div>

                            <Link to="/" className="back-link">
                                <ArrowLeft size={16} />
                                Back to booking
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminLogin;
