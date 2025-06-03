import React from 'react';
import { SimpleScrollArea } from './SimpleScrollArea';

export function ChatArea() {
  return (
    <div className="h-[200px] w-full">
      <SimpleScrollArea className="h-full border rounded-lg">
        <div className="space-y-4 p-4">
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
    </div>
  );
}
