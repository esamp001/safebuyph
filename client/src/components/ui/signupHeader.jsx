import { Button } from './button';
import { Separator } from './separator';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const signupHeader = ({ step, totalSteps, onBack }) => {
  return (
    <nav className="justify-center w-full h-16 bg-white border-b flex items-center px-5 h-[80px] relative overflow-hidden">
      <div className="flex items-center w-full">
        {step > 1 && (
          <Button
            variant="ghost"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors ml-5"
            onClick={onBack}
            aria-label="Go back"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </Button>
        )}
      </div>
      <div className="flex-shrink-0 flex flex-col items-center w-full">
        <div className="font-bold text-2x1 text-center justify-center">SafeBuy</div>
      </div>
    </nav>
  );
};

export default signupHeader;
