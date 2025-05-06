import React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';

function Signup() {
  return (
    <div className="min-h-screen">
      <div className="fixed left-0 top-0 z-50 h-16 w-full bg-background border-b">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <SidebarTrigger />
          </div>
        </SidebarHeader>
      </div>
      <div className="flex pt-16">
        <AppSidebar />
        <main className="flex-1 p-4">{/* Signup form content will go here */}</main>
      </div>
    </div>
  );
}

export default Signup;
