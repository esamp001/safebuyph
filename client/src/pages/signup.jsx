import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenuCheckboxes } from '@/components/ui/DropdownMenuCheckboxes';

function Signup() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const totalSteps = 4;
  const navigate = useNavigate();

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'buyer') {
      setStep(2);
    } else if (selectedRole === 'seller') {
      setStep(100);
    }
  };

  const handleBack = () => setStep(1);

  const renderBuyerSteps = () => (
    <>
      {step === 2 && <FormStep1 onNext={() => setStep(3)} />}
      {step === 3 && <FormStep2 onNext={() => setStep(4)} />}
      {step === 4 && <FormStep4 onSubmit={() => alert('Signup complete!')} />}
    </>
  );

  const renderSellerSteps = () => (
    <>
      {step === 100 && <SellerStep1 onNext={() => setStep(101)} />}
      {step === 101 && <SellerStep2 onNext={() => setStep(102)} />}
      {step === 102 && <SellerStep3 onNext={() => setStep(103)} />}
      {step === 103 && <SellerStep4 onNext={() => setStep(104)} />}
      {step === 104 && <SellerStep5 onSubmit={() => alert('Seller signup complete!')} />}
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
          {role === 'buyer'
            ? `Step ${step - 1} of ${totalSteps - 1}`
            : role === 'seller'
              ? `Step ${step - 99} of 3`
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

function FormStep1({ onNext }) {
  return (
    <Card className="w-full shadow-lg">
      <CardContent className="flex flex-col gap-3 p-6">
        <h2 className="text-2xl font-bold text-[#0e1d54]">Create an account to shop safely</h2>
        <p className="text-sm">Email address</p>
        <Input type="email" placeholder="Enter your email" className="bg-white" />
        <p className="text-sm">Password</p>
        <Input type="password" placeholder="Enter your password" className="bg-white" />
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
          onClick={onNext}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
}

function FormStep2({ onNext }) {
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewImage(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-6">
          <h1 className="text-sm font-medium">Add a profile picture (optional)</h1>
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
          <label className="text-sm font-medium">Name</label>
          <Input type="text" placeholder="Enter your name" className="bg-white" />
          {/* Phone Number (optional) */}
          <label className="text-sm font-medium">
            Phone Number <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <Input type="tel" placeholder="e.g. 09171234567" className="bg-white" />
          {/* Short Bio (optional) */}
          <label className="text-sm font-medium">
            Short Bio <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <textarea
            className="bg-white border rounded-md p-2"
            placeholder="Tell us a bit about yourself..."
            rows={3}
          />
          <div className="flex items-center gap-2">
            <Checkbox />
            <p className="text-sm">I agee to SafeBuy PH's Terms and Privacy Policy</p>
          </div>
          <Button
            className="bg-cyan-500 text-white p-1 w-full rounded-md mt-2 bg-[#0e1d54] hover:bg-[#597aaf]"
            onClick={onNext}
          >
            Next
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function FormStep4({ onSubmit }) {
  return (
    <Card className="w-full shadow-lg">
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <h2 className="text-2xl font-bold text-[#0e1d54] mb-2">You're all set, {name}!</h2>
        <p className="text-center text-gray-600">
          Your account has been created. You can now start browsing deals and requesting secure
          transactions using SafeBuy PH.
        </p>
        <Button
          className="bg-cyan-500 text-white w-full rounded-md mt-2 bg-[#0e1d54] hover:bg-[#597aaf]"
          onClick={onSubmit}
        >
          Go to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}

// Seller Forms

function SellerStep1({ onNext }) {
  return (
    <Card className="w-full shadow-lg">
      <CardContent className="flex flex-col gap-3 p-6">
        <h2 className="text-2xl font-bold text-[#0e1d54]">Open your seller account now</h2>
        <p className="text-sm">Email address</p>
        <Input type="email" placeholder="Enter your email" className="bg-white" />
        <p className="text-sm">Password</p>
        <Input type="password" placeholder="Enter your password" className="bg-white" />
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
          onClick={onNext}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
}

function SellerStep2({ onNext }) {
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewImage(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-6">
          <h1 className="text-sm font-medium">Add a profile picture (optional)</h1>
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
          <label className="text-sm font-medium">Name</label>
          <Input type="text" placeholder="Enter your name" className="bg-white" />
          {/* Phone Number (optional) */}
          <label className="text-sm font-medium">
            Phone Number <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <Input type="tel" placeholder="e.g. 09171234567" className="bg-white" />
          {/* Short Bio (optional) */}
          <label className="text-sm font-medium">
            Short Bio <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <textarea
            className="bg-white border rounded-md p-2"
            placeholder="Tell us a bit about yourself..."
            rows={3}
          />
          <div className="flex items-center gap-2">
            <Checkbox />
            <p className="text-sm">I agee to SafeBuy PH's Terms and Privacy Policy</p>
          </div>
          <Button
            className="bg-cyan-500 text-white p-1 w-full rounded-md mt-2 bg-[#0e1d54] hover:bg-[#597aaf]"
            onClick={onNext}
          >
            Next
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SellerStep3({ onNext }) {
  const [verified, setVerificationData] = useState({
    options: {
      driversLicense: false,
      SSS: false,
      nationalId: false,
      passport: false,
    },
    idNumber: '',
  });

  const handleVerificationChange = (option, idNumber) => {
    setVerificationData({
      options: newOptions,
      idNumber: newIdNumber,
    });
  };

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="flex flex-col gap-3 p-6">
        <h2 className="text-2xl font-bold text-[#0e1d54]">Verify your Seller Profile</h2>
        <p className="text-sm">
          To ensure the authenticity of your account, we need to verify your seller profile.
        </p>
        <label className="text-sm font-medium">Phone Number</label>
        <Input className="bg-white" type="tel" placeholder="Enter your phone number" />
        <label className="text-sm font-medium">Select Valid ID</label>
        <DropdownMenuCheckboxes onVerificationChange={handleVerificationChange} />
        <Button
          className="bg-cyan-500 text-white p-1 w-full rounded-md mt-2 bg-[#0e1d54] hover:bg-[#597aaf]"
          onClick={onNext}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
}

function SellerStep4({ onNext }) {
  return (
    <Card className="w-full shadow-lg">
      <CardContent className="flex flex-col gap-3 p-6">
        <h2 className="text-2xl font-bold text-[#0e1d54]">Seller Step 4</h2>
        <p className="text-sm">This is Seller Step 4.</p>
        <Button
          className="bg-cyan-500 text-white p-1 w-full rounded-md mt-2 bg-[#0e1d54] hover:bg-[#597aaf]"
          onClick={onNext}
        >
          Next
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
