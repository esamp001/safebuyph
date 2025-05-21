import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded border border-gray-300 bg-white',
      'h-5 w-5',
      'p-0 m-0',
      'min-w-0 min-h-0 max-w-[1.5rem] max-h-[1.5rem]',
      'flex-none',
      'hover:border-[#0e1d54]',
      'focus:outline-none focus:ring-2 focus:ring-[#0e1d54] focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'data-[state=checked]:bg-[#0e1d54] data-[state=checked]:border-[#0e1d54]',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center">
      <Check className="h-4 w-4 text-white" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
