import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Package, Bell, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SimpleScrollArea } from '@/components/SimpleScrollArea';

function Dashboard() {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-500">Here's what's happening with your account today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            {/* Message Area */}
            <SimpleScrollArea className="h-[200px] p-4 border-2 border-gray-300 rounded-lg mb-4">
              {/* Sample messages - replace with actual messages */}
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
          </CardContent>
        </Card>

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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-[#1eafd0]" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Order #{item} completed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <button className="text-sm text-[#1eafd0] hover:underline">View Details</button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <SimpleScrollArea className="h-[300px] p-4 border rounded-lg mb-4">
              {/* Sample messages - replace with actual messages */}
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

            {/* Input Area */}
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
    </div>
  );
}

export default Dashboard;
