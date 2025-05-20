import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginHeader from '@/components/ui/loginHeader';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // All validation

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/facebook';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please make sure the server is running.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col bg-[#FFFF]">
      <LoginHeader />
      <div className="flex justify-center mt-10">
        <h1 className="text-3xl font-bold text-center text-[#1f3f6f] font-poppins">
          Sign in to SafeBuyPH
        </h1>
      </div>
      <div className="flex items-center flex-1 bg-gray-50 justify-center bg-[#FFFF]">
        <Card className="w-[400px] shadow-xl border-none mt-[-30px] bg-[#dce1e6]">
          <CardHeader>
            <CardTitle className="text-[#1f3f6f] font-poppins">Buy Smarter, Sell Safely</CardTitle>
            <CardDescription className="font-poppins">
              Join our marketplace today and experience secure trading.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm font-poppins shadow-sm">
                  <svg>...</svg>
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm text-[#1f3f6f] font-poppins font-medium">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0e1d54] focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#1f3f6f] font-poppins font-medium">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0e1d54] focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#0e1d54] font-poppins hover:bg-[#597aaf] focus:ring-0 focus:outline-none border-none transition-transform duration-200 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading && <Spinner className="w-5 h-5 mr-2" />}
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-muted-foreground font-poppins">Or continue with</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full font-poppins"
                  onClick={handleGoogleLogin}
                >
                  <FcGoogle className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full font-poppins"
                  onClick={handleFacebookLogin}
                >
                  <FaFacebook className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
                <p className="text-xs text-gray-500 text-center font-poppins">
                  By continuing, you acknowledge that you understand and agree to the{' '}
                  <a href="#" className="hover:underline">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;
