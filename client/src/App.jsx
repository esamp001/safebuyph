import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import { FormProvider } from './context/FormContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // or however you manage auth

function App() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // or your transaction page
    }
  }, [isAuthenticated, navigate]);

  return (
    <BrowserRouter>
      <FormProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </FormProvider>
    </BrowserRouter>
  );
}

export default App;
