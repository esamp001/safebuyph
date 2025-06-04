import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import { FormProvider } from './context/FormContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LandingPage from './pages/landingPage';
import Dashboard from './pages/dashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import NewTransaction from './pages/NewTransaction';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <FormProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/transaction/new"
          element={
            <DashboardLayout>
              <NewTransaction />
            </DashboardLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </FormProvider>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
