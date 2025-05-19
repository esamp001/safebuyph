import { Button } from './button';
import { Separator } from './separator';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/SAFEBUYPH - TRANS.png';

const signupHeader = ({ step, totalSteps, onBack }) => {
  const navigate = useNavigate();

  return (
    <nav className="relative w-full h-16 bg-white border-b flex items-center px-5 h-[80px] overflow-hidden">
      <div className="absolute left-5 top-1/2 -translate-y-1/2">
        <Button
          variant="ghost"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={step === 1 ? () => navigate('/login') : onBack}
          aria-label="Go back"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          {step === 1 && <span className="ml-2 text-[#0e1d54] text-sm">Back to Login</span>}
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <img src={logo} alt="logo" className="w-26 h-16" />
        <span className="ml-1 text-[#0e1d54] font-semibold">SafeBuy PH</span>
      </div>
    </nav>
  );
};

export default signupHeader;
