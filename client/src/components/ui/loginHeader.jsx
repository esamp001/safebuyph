import { Button } from './button';
import { Separator } from './separator';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/SAFEBUYPH - TRANS.png';

const loginHeader = () => {
  const navigate = useNavigate();
  return (
    <nav className="justify-start w-full h-16 bg-[#498db2] border-b flex items-center px-5 h-[80px] relative overflow-hidden">
      <div className="flex-shrink-0">
        <img src={logo} alt="logo" className="w-26 h-16" />
      </div>
      <Separator orientation="vertical" className="mx-3 h-6" />
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-poppins text-[#FFFF] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:bg-[#0e1d54] hover:text-white"
        >
          About
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-poppins text-[#FFFF] focus:outline-none outline-none ring-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:bg-[#0e1d54] hover:text-white"
        >
          Help
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-poppins text-[#FFFF] focus:outline-none outline-none ring-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:bg-[#0e1d54] hover:text-white"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default loginHeader;
