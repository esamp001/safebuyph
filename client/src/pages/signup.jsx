import React, { useState, useEffect, useRef } from 'react';
import SignupHeader from '@/components/ui/signupHeader';
import { ButtonWithIcon } from '@/components/ui/buttonSignup';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Checkbox } from '@/components/ui/checkbox';
import { data, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenuCheckboxes } from '@/components/ui/DropdownMenuCheckboxes';
import { FormProvider, useForm } from '@/context/FormContext';

function Signup() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [sellerStep1Error, setSellerStep1Error] = useState('');
  const { switchForm } = useForm();
  const totalSteps = 4;
  const navigate = useNavigate();

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    switchForm(selectedRole);

    if (selectedRole === 'buyer') {
      setStep(2);
    } else if (selectedRole === 'seller') {
      setStep(100);
    }
  };

  const handleBack = () => {
    setStep(1);
    setRole(null);
    resetFormData();
  };

  const renderBuyerSteps = () => (
    <>
      {step === 2 && (
        <FormStep1
          onNext={() => setStep(3)}
          error={sellerStep1Error}
          setError={setSellerStep1Error}
        />
      )}
      {step === 3 && <FormStep2 onNext={() => setStep(4)} />}
      {step === 4 && <FormStep4 onSubmit={() => navigate('/dashboard')} />}
    </>
  );

  const renderSellerSteps = () => (
    <>
      {step === 100 && (
        <SellerStep1
          onNext={() => setStep(101)}
          error={sellerStep1Error}
          setError={setSellerStep1Error}
        />
      )}
      {step === 101 && (
        <SellerStep2
          onNext={() => setStep(102)}
          setStep={setStep}
          setSellerStep1Error={setSellerStep1Error}
        />
      )}
      {step === 102 && (
        <SellerStep3
          onNext={() => setStep(103)}
          setStep={setStep}
          setSellerStep1Error={setSellerStep1Error}
        />
      )}
      {step === 103 && <SellerStep4 onNext={() => setStep(104)} />}
      {step === 104 && <SellerStep5 onSubmit={() => navigate('/dashboard')} />}
    </>
  );

  return (
    <div className="min-h-screen bg-login-gradient">
      <SignupHeader step={step} totalSteps={totalSteps} onBack={handleBack} />
      <div className="max-w-xl mx-auto mt-8 p-4">
        <Progress
          value={
            role === 'buyer' ? ((step - 1) / (totalSteps - 1)) * 100 : ((step - 100) / 2) * 100
          }
          className="w-full mb-6"
        />
        <div className="text-sm text-muted-foreground mb-5 text-center">
          {role === 'buyer' && step >= 2 && step <= 3
            ? `Step ${step - 1} of ${totalSteps - 1}`
            : role === 'buyer' && step > 3
              ? 'Buyer registration complete'
              : role === 'seller' && step >= 100 && step <= 102
                ? `Step ${step - 99} of 3`
                : role === 'seller' && step > 102
                  ? 'Seller registration complete'
                  : ''}
        </div>
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold text-[#0e1d54] text-center mb-2">
              Welcome to Safebuy PH!
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Let's start by knowing how you want to use the platform.
            </p>
            <ButtonWithIcon onSelect={handleRoleSelection} />
          </>
        )}
        {role === 'buyer' && renderBuyerSteps()}
        {role === 'seller' && renderSellerSteps()}
      </div>
    </div>
  );
}

function FormStep1({ onNext, error, setError }) {
  const { formData, updateFormData } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
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
      const response = await fetch('http://localhost:3000/api/auth/validate-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Validation failed');
        return;
      }

      onNext();
    } catch (err) {
      console.error('Validation error:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please make sure the server is running.');
      } else {
        setError(err.message || 'Failed to validate credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="flex flex-col gap-3 p-6">
        <h2 className="text-2xl font-bold text-[#0e1d54]">Create an account to shop safely</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm">Email address</p>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="bg-white"
              required
            />
          </div>
          <div>
            <p className="text-sm">Password</p>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="bg-white"
              required
            />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <span className="px-2 text-muted-foreground relative bg-gray-50">Or continue with</span>
          </div>
          <Button variant="outline" className="w-full" onClick={() => {}}>
            <FcGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline" className="w-full" onClick={() => {}}>
            <FaFacebook className="mr-2 h-4 w-4" />
            Facebook
          </Button>
          <Button
            type="submit"
            className="bg-cyan-500 text-white p-1 w-full rounded-md mt-2 bg-[#597aaf] hover:bg-[#0e1d54]"
            disabled={isLoading}
          >
            {isLoading ? 'Validating...' : 'Next'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function FormStep2({ onNext }) {
  const { formData, updateFormData } = useForm();
  const [previewImage, setPreviewImage] = useState(formData.profilePic || null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleCheckboxChange = (checked) => {
    updateFormData({ termsAccepted: checked });
  };

  const validateForm = () => {
    if (!formData.name) {
      setError('Name is required');
      return false;
    }
    if (formData.name.length < 2 || formData.name.length > 50) {
      setError('Name must be between 2 and 50 characters');
      return false;
    }
    if (!formData.profilePic) {
      setError('Profile picture is required');
      return false;
    }
    if (!formData.termsAccepted) {
      setError('You must accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('File size must be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('File must be an image');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({ profilePic: reader.result });
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    updateFormData({ profilePic: null });
    setPreviewImage(null);
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
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          profilePic: formData.profilePic,
          bio: formData.bio,
          role: 'buyer',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error && data.error.toLowerCase().includes('email')) {
          setError('Email already registered');
        } else {
          setError(data.error || 'Registration failed');
        }
        return;
      }

      // After successful registration, automatically login
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
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

      if (!loginResponse.ok) {
        setError('Login failed after registration');
        return;
      }

      onNext();
    } catch (err) {
      console.error('Registration error:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please make sure the server is running.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-6">
          <h1 className="text-sm font-medium">Add a profile picture</h1>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-500">Adding a profile picture builds trust</p>
          </div>

          {/* Avatar Preview and Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#0e1d54] transition-all duration-200">
                <Avatar className="w-full h-full">
                  <AvatarImage src={previewImage} className="object-cover w-full h-full" />
                  <AvatarFallback className="text-sm bg-gray-100">CN</AvatarFallback>
                </Avatar>
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full cursor-pointer"
              >
                <span className="text-white text-xs">Change Photo</span>
              </label>
              {previewImage && (
                <button
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors duration-200"
                >
                  <XMarkIcon className="h-4 w-4 text-red-500" />
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full shadow-lg">
        <CardContent className="flex flex-col gap-3 p-6">
          <h2 className="text-2xl font-bold text-[#0e1d54]">Tell us about yourself</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <label className="text-sm font-medium">Name</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="bg-white"
          />
          <label className="text-sm font-medium">
            Phone Number <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <Input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="e.g. 09171234567"
            className="bg-white"
          />
          <label className="text-sm font-medium">
            Short Bio <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="bg-white border rounded-md p-2"
            placeholder="Tell us a bit about yourself..."
            rows={3}
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="termsAccepted"
              checked={formData.termsAccepted}
              onCheckedChange={handleCheckboxChange}
            />
            <label htmlFor="termsAccepted" className="text-sm cursor-pointer">
              I agree to SafeBuy PH's Terms and Privacy Policy
            </label>
          </div>
          <Button
            className="bg-cyan-500 text-white p-1 w-full rounded-md mt-2 bg-[#597aaf] hover:bg-[#0e1d54]"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Next'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function FormStep4({ onSubmit }) {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/dashboard');
  };

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <h2 className="text-2xl font-bold text-[#0e1d54] mb-2">You're all set!</h2>
        <p className="text-center text-gray-600">
          Your account has been created. You can now start browsing deals and requesting secure
          transactions using SafeBuy PH.
        </p>
        <Button
          className="bg-cyan-500 text-white w-full rounded-md mt-2 bg-[#0e1d54] hover:bg-[#597aaf]"
          onClick={handleSubmit}
        >
          Go to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}

// Seller Forms
function SellerStep1({ onNext, error, setError }) {
  const { formData, updateFormData } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
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
      console.log('Sending validation request with:', { email: formData.email }); // Debug log
      const response = await fetch('http://localhost:3000/api/auth/validate-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log('Response status:', response.status); // Debug log
      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (!response.ok) {
        setError(data.error || 'Validation failed');
        return;
      }

      onNext();
    } catch (err) {
      console.error('Full error object:', err); // More detailed error logging
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);

      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please make sure the server is running.');
      } else {
        setError(err.message || 'Failed to validate credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="flex flex-col gap-3 p-6">
        <h2 className="text-2xl font-bold text-[#0e1d54]">Open your seller account now</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-sm">Email address</p>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="bg-white"
          required
        />
        <p className="text-sm">Password</p>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="bg-white"
          required
        />
        <div className="relative flex justify-center text-xs uppercase">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <span className="px-2 text-muted-foreground relative bg-gray-50">Or continue with</span>
        </div>
        <Button variant="outline" className="w-full" onClick={() => {}}>
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button variant="outline" className="w-full" onClick={() => {}}>
          <FaFacebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
        <Button
          className="bg-cyan-500 text-white p-1 w-full rounded-md mt-2 bg-[#597aaf] hover:bg-[#0e1d54]"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Validating...' : 'Next'}
        </Button>
      </CardContent>
    </Card>
  );
}

function SellerStep2({ onNext, setStep, setSellerStep1Error }) {
  const { formData, updateFormData } = useForm();
  const [previewImage, setPreviewImage] = useState(formData.profilePic || null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleCheckboxChange = (checked) => {
    updateFormData({ termsAccepted: checked });
  };

  const validateForm = () => {
    if (!formData.name) {
      setError('Name is required');
      return false;
    }
    if (formData.name.length < 2 || formData.name.length > 50) {
      setError('Name must be between 2 and 50 characters');
      return false;
    }
    if (!formData.profilePic) {
      setError('Profile picture is required');
      return false;
    }
    if (!formData.termsAccepted) {
      setError('You must accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('File size must be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('File must be an image');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({ profilePic: reader.result });
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    updateFormData({ profilePic: null });
    setPreviewImage(null);
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
      console.log('Starting registration...');

      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          profilePic: formData.profilePic,
          bio: formData.bio,
          role: 'seller',
        }),
      });

      console.log('Registration response headers:', response.headers);
      const data = await response.json();
      console.log('Registration response data:', data);
      console.log('Cookies after registration:', document.cookie);

      if (!response.ok) {
        if (data.error && data.error.toLowerCase().includes('email')) {
          setError('Email already registered');
        } else {
          setError(data.error || 'Registration failed');
        }
        return;
      }

      // After successful registration, automatically login
      console.log('Starting login...');

      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
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

      console.log('Login response headers:', loginResponse.headers);
      const loginData = await loginResponse.json();
      console.log('Login response data:', loginData);
      console.log('Cookies after login:', document.cookie);

      if (!loginResponse.ok) {
        setError(loginData.error || 'Login failed after registration');
        return;
      }

      onNext();
    } catch (err) {
      console.error('Registration error:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please make sure the server is running.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-6">
          <h1 className="text-sm font-medium">Add a profile picture</h1>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-500">Adding a profile picture builds trust</p>
          </div>

          {/* Avatar Preview and Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#0e1d54] transition-all duration-200">
                <Avatar className="w-full h-full">
                  <AvatarImage src={previewImage} className="object-cover w-full h-full" />
                  <AvatarFallback className="text-sm bg-gray-100">CN</AvatarFallback>
                </Avatar>
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full cursor-pointer"
              >
                <span className="text-white text-xs">Change Photo</span>
              </label>
              {previewImage && (
                <button
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors duration-200"
                >
                  <XMarkIcon className="h-4 w-4 text-red-500" />
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full shadow-lg">
        <CardContent className="flex flex-col gap-3 p-6">
          <h2 className="text-2xl font-bold text-[#0e1d54]">Tell us about yourself</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <label className="text-sm font-medium">Name</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="bg-white"
          />
          <label className="text-sm font-medium">
            Phone Number <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <Input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="e.g. 09171234567"
            className="bg-white"
          />
          <label className="text-sm font-medium">
            Short Bio <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="bg-white border rounded-md p-2"
            placeholder="Tell us a bit about yourself..."
            rows={3}
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="termsAccepted"
              checked={formData.termsAccepted}
              onCheckedChange={handleCheckboxChange}
            />
            <label htmlFor="termsAccepted" className="text-sm cursor-pointer">
              I agree to SafeBuy PH's Terms and Privacy Policy
            </label>
          </div>
          <Button
            className="bg-cyan-500 text-white p-1 w-full rounded-md mt-2 bg-[#597aaf] hover:bg-[#0e1d54]"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Next'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SellerStep3({ onNext, setStep, setSellerStep1Error }) {
  const { formData, updateFormData } = useForm();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [idPreview, setIdPreview] = useState(formData.idPhoto || null);

  const handleVerificationChange = (options, idNumbers) => {
    const selectedIdType = Object.keys(options).find((key) => options[key]);
    const selectedIdNumber = selectedIdType ? idNumbers[selectedIdType] : '';

    updateFormData({
      verificationType: selectedIdType || '',
      idNumber: selectedIdNumber,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleDescriptionChange = (e) => {
    updateFormData({ sellingDescription: e.target.value });
  };

  const handleIdPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('File size must be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('File must be an image');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({
          idPhoto: reader.result,
          verificationType: 'government_id', // Set a default verification type
        });
        setIdPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.phoneNumber) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.verificationType) {
      setError('Please select a valid ID');
      return false;
    }
    if (!formData.idNumber) {
      setError('ID number is required');
      return false;
    }
    if (!formData.sellingDescription) {
      setError('Please provide a description of what you are selling');
      return false;
    }
    if (!formData.termsAccepted) {
      setError('You must accept the terms and conditions');
      return false;
    }
    return true;
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
      // Get the cookie Value
      console.log('Current cookies before request:', document.cookie);

      // Only verify seller status since we're already registered
      const verifyResponse = await fetch('http://localhost:3000/api/profile/become-seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include', // This will send the existing auth cookie
        body: JSON.stringify({
          validIdUrl: formData.idPhoto,
          validIdNumber: formData.idNumber,
          sellingDescription: formData.sellingDescription,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setError(verifyData.message || 'Failed to verify seller status');
        return;
      }

      onNext();
    } catch (err) {
      console.error('Seller verification error:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please make sure the server is running.');
      } else {
        setError(err.message || 'Failed to verify seller status. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="flex flex-col gap-3 p-6">
        {idPreview && (
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold text-[#0e1d54]">Verify your Seller Profile</h2>
            <p className="text-sm">
              To ensure the authenticity of your account, we need to verify your seller profile.
            </p>
          </div>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <label className="text-sm font-medium">Upload your Valid ID</label>

        {idPreview && (
          <div className="flex flex-col items-center gap-2 mt-2">
            <img
              src={idPreview}
              alt="ID Preview"
              className="w-44 h-30 object-contain border rounded shadow"
            />
            <button
              type="button"
              onClick={() => {
                updateFormData({ idPhoto: null });
                setIdPreview(null);
              }}
              className="text-xs text-red-500 underline mt-1"
            >
              Remove
            </button>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleIdPhotoChange} />
        <DropdownMenuCheckboxes onVerificationChange={handleVerificationChange} />

        <label className="text-sm font-medium">Description of what you're selling</label>
        <textarea
          name="sellingDescription"
          value={formData.sellingDescription}
          onChange={handleDescriptionChange}
          className="bg-white border rounded-md p-2"
          placeholder="I usually sell electronics like phones and gaming consoles..."
          rows={3}
        />
        <div className="flex items-center gap-2">
          <Checkbox
            id="termsAccepted"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => updateFormData({ termsAccepted: checked })}
          />
          <label htmlFor="termsAccepted" className="text-sm cursor-pointer">
            I agree to SafeBuy PH's Terms and Privacy Policy
          </label>
        </div>
        <Button
          className="bg-cyan-500 text-white p-1 w-full rounded-md mt-2 bg-[#597aaf] hover:bg-[#0e1d54]"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Next'}
        </Button>
      </CardContent>
    </Card>
  );
}

function SellerStep4({ onNext }) {
  return (
    <Card className="w-full shadow-lg">
      <CardContent className="flex flex-col gap-3 p-6">
        <h2 className="text-2xl font-bold text-[#0e1d54]">Thank you for signing up!</h2>
        <p className="text-center text-gray-600">
          Your profile is being reviewed for seller access. Meanwhile, you can still browse the
          platform and buyer items.
        </p>
        <Button
          className="bg-cyan-500 text-white p-1 w-full rounded-md mt-2 bg-[#0e1d54] hover:bg-[#597aaf]"
          onClick={onNext}
        >
          Go to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}

function SellerStep5({ onSubmit }) {
  return (
    <Card className="w-full shadow-lg">
      <CardContent className="flex flex-col gap-3 p-6">
        <h2 className="text-2xl font-bold text-[#0e1d54]">Seller Step 5</h2>
        <p className="text-sm">This is Seller Step 5.</p>
        <Button
          className="bg-cyan-500 text-white p-1 w-full rounded-md mt-2 bg-[#0e1d54] hover:bg-[#597aaf]"
          onClick={onSubmit}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}

export default Signup;
