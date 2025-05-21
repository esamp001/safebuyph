import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/SAFEBUYPH - TRANS.png';

const LandingPageHeader = () => {
  const navigate = useNavigate();

  return (
    <nav className="relative bg-[#498db2] w-full h-16 border-b flex items-center px-5 h-[80px] overflow-hidden">
      <div className="flex-shrink-0">
        <img src={logo} alt="SafeBuy PH Logo" className="w-26 h-16" />
        <label className="text-white font-poppins text-2 font-bold mt-2">
          Escrow-Powered Marketplace
        </label>
      </div>
    </nav>
  );
};

export default LandingPageHeader;
