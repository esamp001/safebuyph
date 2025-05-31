import { Button } from './button';
import { Separator } from './separator';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/SAFEBUYPH - TRANS.png';

const signupHeader = ({ step, totalSteps, onBack }) => {
  const navigate = useNavigate();

  return (
    <nav className="relative bg-[#498db2] w-full h-16 border-b flex items-center px-5 h-[80px] overflow-hidden">
      <div className="absolute left-5 top-1/2 -translate-y-1/2">
        <Button
          variant="ghost"
          className="p-2 rounded-full flex items-center text-sm font-poppins text-[#0e1d54] bg-transparent hover:bg-[#0e1d54] hover:text-white transition-colors"
          onClick={step === 1 ? () => navigate('/') : onBack}
          aria-label="Go back"
        >
          <ChevronLeftIcon className="w-6 h-6" />
          {step === 1 && <span className="ml-2 text-white">Back to Home</span>}
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div
          className="flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity duration-200"
          onClick={() => navigate('/')}
        >
          <img src={logo} alt="SafeBuy PH Logo" className="w-26 h-16" />
        </div>
        <span className="ml-1 text-[#0e1d54] font-semibold font-poppins text-white">
          SafeBuy PH
        </span>
      </div>
    </nav>
  );
};

export default signupHeader;
