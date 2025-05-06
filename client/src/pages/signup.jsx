import React, { useState } from 'react';
import SignupHeader from '@/components/ui/signupHeader';
import { ButtonWithIcon } from '@/components/ui/buttonSignup';
import { Progress } from '@/components/ui/progress';

function Signup() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-gray-50">
      <SignupHeader />
      <div className="max-w-xl mx-auto mt-8 p-4">
        <Progress value={(step / totalSteps) * 100} className="w-full mb-6" />
        {step === 1 && <ButtonWithIcon onNext={() => setStep(2)} />}
        {step === 2 && <FormStep1 onNext={() => setStep(3)} />}
        {step === 3 && <FormStep2 onNext={() => setStep(4)} />}
        {step === 4 && <FormStep3 onSubmit={() => alert('Signup complete!')} />}
      </div>
    </div>
  );
}

export default Signup;
