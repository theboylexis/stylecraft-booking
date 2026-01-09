import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedAdmin = localStorage.getItem('admin');

        if (token && savedAdmin) {
            setAdmin(JSON.parse(savedAdmin));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('admin', JSON.stringify(data));
        setAdmin(data);
        return data;
    };

    const register = async (name, email, password) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('admin', JSON.stringify(data));
        setAdmin(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setAdmin(null);
    };

    const getToken = () => {
        return localStorage.getItem('token');
    };

    return (
        <AuthContext.Provider value={{ admin, loading, login, register, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
