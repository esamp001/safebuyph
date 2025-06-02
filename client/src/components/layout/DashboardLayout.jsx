import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-40 h-screen bg-white border-r w-64">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-[#1eafd0]">SafeBuyPH</h1>
          {/* Add navigation items here later */}
          <nav className="mt-6 space-y-4">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <HomeIcon className="w-4 h-4 mr-2" />
              Home
            </Button>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default DashboardLayout;
