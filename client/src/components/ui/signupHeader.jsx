import { Separator } from './separator';

const signupHeader = () => {
  return (
    <nav className="justify-start w-full h-16 bg-white border-b flex items-center px-5 h-[80px] relative overflow-hidden">
      <div className="flex-shrink-0">
        <div className="font-bold text-2x1 text-center">SafeBuy</div>
      </div>
      <Separator orientation="vertical" className="mx-3 h-6" />
      <div className="flex items-center space-x-1"></div>
    </nav>
  );
};

export default signupHeader;
