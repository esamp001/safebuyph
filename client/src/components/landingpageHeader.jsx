import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const LandingPageHeader = () => {
  const navigate = useNavigate();

  return (
    <nav className="relative bg-[#498db2] w-full h-16 border-b flex items-center px-5 h-[80px] overflow-hidden">
      <h1>THIS IS LANDING HEADER</h1>
    </nav>
  );
};

export default LandingPageHeader;
