import { Button } from './button';
import { Separator } from './separator';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/SAFEBUYPH - TRANS.png';

const LoginHeader = () => {
  const navigate = useNavigate();
  return (
    <nav className="justify-start w-full h-16 bg-[#498db2] border-b flex items-center px-5 h-[80px] relative overflow-hidden">
      <div className="flex-shrink-0">
        <img src={logo} alt="SafeBuy PH Logo" className="w-26 h-16" />
      </div>
      <Separator orientation="vertical" className="mx-3 h-6" />
      <div className="flex items-center space-x-1">
        <Button className="bg-transparent text-white font-poppins px-5 py-2 rounded-lg shadow-none border-none hover:text-[#dce1e6] transition-colors duration-200 focus:outline-none focus:ring-0 active:text-[#dce1e6]">
          About
        </Button>
        <Button className="bg-transparent text-white font-poppins px-5 py-2 rounded-lg shadow-none border-none hover:text-[#dce1e6] transition-colors duration-200 focus:outline-none focus:ring-0 active:text-[#dce1e6]">
          Help
        </Button>
        <Button
          className="bg-transparent text-white font-poppins px-5 py-2 rounded-lg shadow-none border-none hover:text-[#dce1e6] transition-colors duration-200 focus:outline-none focus:ring-0 active:text-[#dce1e6]"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default LoginHeader;
