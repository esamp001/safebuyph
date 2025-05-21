import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/check', {
        credentials: 'include',
      });
      if (response.status === 401) {
        setUser(null);
        return;
      }
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUser(data.user);
        navigate('/dashboard');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUser(data.user);
        navigate('/dashboard');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // The provider value - everything you want to expose to your app
  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    register,
    checkAuthStatus,
  };

  // If still checking auth status, show a loading indicator
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Provide the auth context to the app
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
