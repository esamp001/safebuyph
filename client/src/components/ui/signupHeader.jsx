import { Button } from './button';
import { Separator } from './separator';

const signupHeader = () => {
  return (
    <nav className="justify-center w-full h-16 bg-white border-b flex items-center px-5 h-[80px] relative overflow-hidden">
      <div className="flex-shrink-0">
        <div className="font-bold text-2x1 text-center justify-center">SafeBuy</div>
      </div>
    </nav>
  );
};

export default signupHeader;
