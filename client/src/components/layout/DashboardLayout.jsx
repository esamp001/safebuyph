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
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DialogLoginAgain from '@/components/layout/DialogLoginAgain';
import { useSession } from '@/context/SessionContext';

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
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const { sessionExpired, setSessionExpired } = useSession();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DialogLoginAgain sessionExpired={sessionExpired} onClose={() => setSessionExpired(false)} />
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-[#1eafd0]">SafeBuyPH</h1>
              {user?.name && <p className="text-sm text-gray-600">Welcome back, {user.name}</p>}
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profilePic} alt={user?.name} />
                    <AvatarFallback className="bg-[#1eafd0] text-white font-medium">
                      {user?.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'No email'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navigationItems.slice(3, 5).map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem
                      key={item.label}
                      onClick={() => navigate(item.href)}
                      className="cursor-pointer"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="container mx-auto p-4">
          {isDashboard ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Left Side - Transaction History & Chat List */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-8rem)]">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Transactions</h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="h-8 bg-[#1eafd0] text-white hover:bg-[#1eafd0]/90">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                              New Transaction
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Start New Transaction</DialogTitle>
                              <DialogDescription>
                                Choose how you want to start your transaction
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Button
                                className="h-24 flex flex-col items-start justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200"
                                onClick={() => navigate('/transaction/new')}
                              >
                                <div className="w-12 h-12 rounded-full bg-[#1eafd0]/10 flex items-center justify-center">
                                  <FilePlus className="w-6 h-6 text-[#1eafd0]" />
                                </div>
                                <div className="flex flex-col items-start">
                                  <span className="font-medium text-[#1f3f6f]">
                                    Create New Transaction
                                  </span>
                                  <span className="text-sm text-gray-500">Start from scratch</span>
                                </div>
                              </Button>
                              <Button
                                className="h-24 flex flex-col items-start justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200"
                                onClick={() => navigate('/import')}
                              >
                                <div className="w-12 h-12 rounded-full bg-[#1eafd0]/10 flex items-center justify-center">
                                  <Facebook className="w-6 h-6 text-[#1eafd0]" />
                                </div>
                                <div className="flex flex-col items-start">
                                  <span className="font-medium text-[#1f3f6f]">
                                    Import from Facebook
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Import from Facebook Marketplace
                                  </span>
                                </div>
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <Input placeholder="Search transactions..." className="w-full" />
                    </div>

                    {/* Transaction List */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="divide-y">
                        {/* Sample transaction items - replace with actual data */}
                        <div className="p-4 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src="/placeholder-product.jpg"
                                alt="Product"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">iPhone 13 Pro Max</p>
                                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                  Pending
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 truncate">John Doe</p>
                              <p className="text-xs text-gray-400">Last message: 2m ago</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src="/placeholder-product.jpg"
                                alt="Product"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">MacBook Air M2</p>
                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                  Paid
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 truncate">Jane Smith</p>
                              <p className="text-xs text-gray-400">Last message: 5m ago</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src="/placeholder-product.jpg"
                                alt="Product"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Samsung Galaxy S23</p>
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                  Shipped
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 truncate">Mike Johnson</p>
                              <p className="text-xs text-gray-400">Last message: 1h ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Conversation Area */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-8rem)]">
                  <div className="flex flex-col h-full">
                    {/* Chat Header */}
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <img
                              src="/placeholder-product.jpg"
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">iPhone 13 Pro Max</h3>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-500">John Doe</p>
                              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Report Issue
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Sample messages - replace with actual data */}
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                          <p className="text-sm">
                            Hi! I'm interested in the iPhone 13 Pro Max. Is it still available?
                          </p>
                          <span className="text-xs text-gray-500">10:30 AM</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-[#1eafd0] text-white rounded-lg p-3 max-w-[70%]">
                          <p className="text-sm">
                            Yes, it's still available! Would you like to proceed with the
                            transaction?
                          </p>
                          <span className="text-xs text-white/80">10:31 AM</span>
                        </div>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Input placeholder="Type your message..." className="flex-1" />
                        <Button>Send</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">{children}</div>
          )}
        </main>
      </div>
    </>
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
