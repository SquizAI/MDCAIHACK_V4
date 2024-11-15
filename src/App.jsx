import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Regular imports instead of lazy loading for critical components
import Navbar from './components/Navbar';
import Home from './components/Home';
import UserLogin from './components/UserLogin';
import Register from './components/Register';
import Schedule from './components/Schedule';

// Lazy load admin and dashboard components
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const Dashboard = lazy(() => import('./components/admin/Dashboard'));
const ParticipantDashboard = lazy(() => import('./components/auth/ParticipantDashboard'));
const VolunteerDashboard = lazy(() => import('./components/auth/VolunteerDashboard'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-16">
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<UserLogin />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route 
                    path="/participant/dashboard" 
                    element={<ParticipantDashboard />}
                  />
                  <Route 
                    path="/volunteer/dashboard" 
                    element={<VolunteerDashboard />}
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;