import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  LogOut,
  User,
  ShoppingCart,
  Menu,
  X,
  Package,
  MessageSquare,
  History,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  FileText,
  Wallet,
  BarChart,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      description: 'Overview of your account',
    },
    {
      label: 'Transactions',
      icon: ShoppingCart,
      href: '/dashboard/transactions',
      description: 'Manage your transactions',
      subItems: [
        {
          label: 'New Transaction',
          href: '/dashboard/transactions/new',
          description: 'Create a new transaction',
        },
        {
          label: 'Active Transactions',
          href: '/dashboard/transactions/active',
          description: 'View ongoing transactions',
        },
        {
          label: 'Transaction History',
          href: '/dashboard/transactions/history',
          description: 'View past transactions',
        },
      ],
    },
    {
      label: 'Products',
      icon: Package,
      href: '/dashboard/products',
      description: 'Manage your products',
      subItems: [
        {
          label: 'My Products',
          href: '/dashboard/products/my-products',
          description: 'View your listed products',
        },
        {
          label: 'Import from FB',
          href: '/dashboard/products/import',
          description: 'Import products from Facebook',
        },
        {
          label: 'Product Analytics',
          href: '/dashboard/products/analytics',
          description: 'View product performance',
        },
      ],
    },
    {
      label: 'Messages',
      icon: MessageSquare,
      href: '/dashboard/messages',
      description: 'Chat with buyers and sellers',
      badge: '3', // For unread messages
    },
    {
      label: 'Escrow',
      icon: Shield,
      href: '/dashboard/escrow',
      description: 'Manage escrow payments',
      subItems: [
        {
          label: 'Active Escrows',
          href: '/dashboard/escrow/active',
          description: 'View active escrow payments',
        },
        {
          label: 'Escrow History',
          href: '/dashboard/escrow/history',
          description: 'View past escrow transactions',
        },
      ],
    },
    {
      label: 'Wallet',
      icon: Wallet,
      href: '/dashboard/wallet',
      description: 'Manage your payments and balance',
    },
    {
      label: 'Reports',
      icon: BarChart,
      href: '/dashboard/reports',
      description: 'View transaction reports and analytics',
    },
    {
      label: 'Support',
      icon: HelpCircle,
      href: '/dashboard/support',
      description: 'Get help and support',
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen transition-transform',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-background bg-white w-64">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">SafeBuyPH</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href={item.href}>
                    <item.icon className="w-5 h-5 mr-2" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </Button>
                {item.subItems && (
                  <div className="ml-6 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Button
                        key={subItem.label}
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        asChild
                      >
                        <a href={subItem.href}>{subItem.label}</a>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn('transition-all duration-300', isSidebarOpen ? 'lg:ml-64' : 'ml-0')}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-4">{/* Add your header content here */}</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
