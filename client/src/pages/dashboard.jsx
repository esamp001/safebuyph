import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Package, Bell, TrendingUp, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SimpleScrollArea } from '@/components/SimpleScrollArea';

function Dashboard() {
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);

  // Sample data for transactions/chats
  const transactions = [
    {
      id: 1,
      product: 'iPhone 13',
      otherParty: 'John Doe',
      lastMessage: 'When can we meet?',
      timestamp: '2 hours ago',
      unread: 2,
      status: 'Pending',
    },
    {
      id: 2,
      product: 'MacBook Pro',
      otherParty: 'Jane Smith',
      lastMessage: 'Payment received',
      timestamp: '1 day ago',
      unread: 0,
      status: 'Completed',
    },
    {
      id: 3,
      product: 'AirPods Pro',
      otherParty: 'Mike Johnson',
      lastMessage: 'Thanks for the quick delivery!',
      timestamp: '3 days ago',
      unread: 0,
      status: 'Completed',
    },
  ];

  const handleSendMessage = () => {
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white p-4 flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Transactions</h2>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search transactions..." className="pl-8" />
          </div>
        </div>

        <SimpleScrollArea className="flex-1">
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedChat === transaction.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedChat(transaction.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{transaction.product}</h3>
                    <p className="text-sm text-gray-500">{transaction.otherParty}</p>
                  </div>
                  <span className="text-xs text-gray-500">{transaction.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">{transaction.lastMessage}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {transaction.status}
                  </span>
                  {transaction.unread > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                      {transaction.unread} new
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SimpleScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-500">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Listings</CardTitle>
              <Package className="h-4 w-4 text-[#1eafd0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Transactions</CardTitle>
              <Bell className="h-4 w-4 text-[#1eafd0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Account Balance</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#1eafd0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱2,500</div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        {selectedChat ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {transactions.find((t) => t.id === selectedChat)?.product} -
                {transactions.find((t) => t.id === selectedChat)?.otherParty}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <SimpleScrollArea className="h-[300px] p-4 border rounded-lg mb-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">System</p>
                        <p className="text-sm text-gray-600">
                          Welcome to SafeBuyPH! How can I help you today?
                        </p>
                      </div>
                    </div>
                  </div>
                </SimpleScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message or paste Facebook Marketplace link..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-[400px]">
              <p className="text-gray-500">Select a transaction to start chatting</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
