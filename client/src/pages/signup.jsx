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

function Signup() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const totalSteps = 4;

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleBack = () => setStep((prev) => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-login-gradient">
      <SignupHeader step={step} totalSteps={totalSteps} onBack={handleBack} />
      <div className="max-w-xl mx-auto mt-8 p-4">
        <Progress value={(step / totalSteps) * 100} className="w-full mb-6" />
        <div className="text-sm text-muted-foreground mb-5 text-center">
          Step {step} of {totalSteps}
        </div>
        {step === 1 && <ButtonWithIcon onSelect={handleRoleSelection} />}
        {step === 2 && <FormStep1 onNext={() => setStep(3)} />}
        {step === 3 && <FormStep2 onNext={() => setStep(4)} />}
        {step === 4 && <FormStep3 onSubmit={() => alert('Signup complete!')} />}
      </div>
    </div>
  );
}

function FormStep1({ onNext }) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-3 p-6">
        <h2 className="text-2xl font-bold">Sign up to start your transaction now!</h2>
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
          className="bg-cyan-500 text-white p-1 w-full rounded-md mt-2 bg-[#0e1d54]"
          onClick={onNext}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
}

function FormStep2({ onNext }) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-3 p-6">
        <h2 className="text-2xl font-bold">Verify your Number</h2>
        <p className="text-sm">Enter the 4-digit code sent to your number</p>
        <Input type="text" placeholder="Enter the code" className="bg-white" />
        <Button
          className="bg-cyan-500 text-white p-1 w-full rounded-md mt-2 bg-[#0e1d54]"
          onClick={onNext}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
}

export default Signup;
