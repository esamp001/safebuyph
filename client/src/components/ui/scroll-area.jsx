'use client';

import React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

const ScrollArea = React.forwardRef(({ children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className="relative overflow-hidden" {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar
      className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-150 ease-out hover:bg-gray-200 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
      orientation="vertical"
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-gray-400" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = 'ScrollArea';

export { ScrollArea };
