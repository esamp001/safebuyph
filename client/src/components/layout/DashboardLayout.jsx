import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FilePlus,
  Facebook,
  Package,
  Wallet,
  HelpCircle,
  Settings,
  LogOut,
  FileClock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navigationItems = [
  {
    label: 'New Transaction',
    icon: FilePlus,
    href: '/transaction/new',
    description: 'Start a new transaction',
  },
  {
    label: 'Active Transactions',
    icon: FileClock,
    href: '/transactions',
    description: 'View your ongoing transactions',
  },
  {
    label: 'Import from FB',
    icon: Facebook,
    href: '/import',
    description: 'Import items from Facebook Marketplace',
  },
  {
    label: 'My Items',
    icon: Package,
    href: '/items',
    description: 'Manage your items',
  },
  {
    label: 'Wallet',
    icon: Wallet,
    href: '/wallet',
    description: 'Manage your payments',
  },
  {
    label: 'Support',
    icon: HelpCircle,
    href: '/support',
    description: 'Get help',
  },
];

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-[#1eafd0]">SafeBuyPH</h1>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User Name</p>
                  <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navigationItems.slice(3, 5).map((item) => (
                <DropdownMenuItem key={item.label} onClick={() => navigate(item.href)}>
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto p-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {navigationItems.slice(0, 4).map((item) => (
            <Button
              key={item.label}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate(item.href)}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg p-4">{children}</div>
      </main>
    </div>
  );
};

const TransactionChat = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">{/* Messages will go here */}</ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-4">
          <Input
            placeholder="Type your message or paste Facebook Marketplace link..."
            className="flex-1"
          />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
