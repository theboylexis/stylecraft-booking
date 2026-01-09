import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PublicBooking from './pages/PublicBooking/PublicBooking';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import BookingConfirmation from './pages/BookingConfirmation/BookingConfirmation';
import './index.css';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public booking page - customer facing */}
      <Route path="/" element={<PublicBooking />} />

      {/* Booking confirmation page */}
      <Route path="/confirmation/:bookingId" element={<BookingConfirmation />} />

      {/* Admin login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin dashboard - protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
