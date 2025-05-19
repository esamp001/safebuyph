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
          className="text-sm text-[#FFFF] focus:outline-none outline-none ring-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        >
          About
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-[#FFFF] focus:outline-none outline-none ring-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        >
          Help
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-[#FFFF] focus:outline-none outline-none ring-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default loginHeader;
