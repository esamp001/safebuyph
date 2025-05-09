import { Button } from './button';
import { Separator } from './separator';
import { useNavigate } from 'react-router-dom';

const loginHeader = () => {
  const navigate = useNavigate();
  return (
    <nav className="justify-start w-full h-16 bg-white border-b flex items-center px-5 h-[80px] relative overflow-hidden">
      <div className="flex-shrink-0">
        <div className="font-bold text-2x1">SafeBuy</div>
      </div>
      <Separator orientation="vertical" className="mx-3 h-6" />
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" className="text-sm">
          About
        </Button>
        <Button variant="ghost" size="sm" className="text-sm">
          Help
        </Button>
        <Button variant="ghost" size="sm" className="text-sm" onClick={() => navigate('/signup')}>
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default loginHeader;
