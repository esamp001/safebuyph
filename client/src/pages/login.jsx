import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { SocialLoginButton } from '@/components/ui/SocialLoginButton';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginHeader from '@/components/ui/loginHeader';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login, checkAuthStatus } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleEmailInput = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, email: value }));
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, email: value }));
    }, 10);
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

    // Get the email value from the ref
    const email = emailRef.current.value;

    if (!email) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, formData.password);

      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
        return;
      }

      await checkAuthStatus();
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
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-400 text-red-700 px-3 py-2 rounded text-sm font-poppins">
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm text-[#1f3f6f] font-poppins font-medium">Email</label>
                <Input
                  type="email"
                  name="email"
                  ref={emailRef}
                  defaultValue={formData.email}
                  autoComplete="email"
                  placeholder="m@example.com"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0e1d54] focus:border-[#0e1d54] transition-all duration-300"
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
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#0e1d54] font-poppins hover:bg-[#0C163F] focus:ring-0 focus:outline-none border-none transition-transform duration-200 hover:scale-105"
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
                <SocialLoginButton icon={FcGoogle} text="Google" onClick={handleGoogleLogin} />
                <SocialLoginButton
                  icon={FaFacebook}
                  text="Facebook"
                  onClick={handleFacebookLogin}
                />
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
            <div className="pt-4 mt-4 border-t">
              <Button
                variant="ghost"
                className="w-full font-poppins text-[#1f3f6f] hover:text-[#0e1d54] hover:bg-[#dce1e6]"
                onClick={() => navigate('/')}
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;
