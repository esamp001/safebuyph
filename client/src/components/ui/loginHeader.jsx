import { Button } from './button';
import { Separator } from './separator';

const loginHeader = () => {
  return (
    <nav className="justify-start w-full h-16 bg-white border-b flex items-center px-5 h-[80px] relative overflow-hidden">
      <div className="flex-shrink-0">
        <div className="font-bold text-lg">SafeBuy</div>
      </div>
      <Separator orientation="vertical" className="mx-3 h-6" />
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm">
          About
        </Button>
        <Button variant="ghost" size="sm">
          Help
        </Button>
        <Button variant="ghost" size="sm">
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default loginHeader;
