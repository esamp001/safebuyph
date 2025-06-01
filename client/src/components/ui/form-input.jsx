import React from 'react';
import { Input } from '@/components/ui/input';

export const FormInput = React.forwardRef(
  (
    {
      type = 'text',
      name,
      value,
      onChange,
      placeholder,
      label,
      error,
      optional = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-[#0e1d54] font-poppins">
            {label}
            {optional && <span className="text-xs text-muted-foreground ml-1">(optional)</span>}
          </label>
        )}
        <Input
          ref={ref}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
          w-full 
          font-poppins 
          bg-white 
          text-[#0e1d54] 
          placeholder:text-gray-400 
          border 
          border-gray-300 
          rounded-lg 
          px-3 
          py-2 
          transition-all 
          duration-300
          focus:outline-none 
          focus:ring-2 
          focus:ring-[#0e1d54] 
          focus:border-transparent
          hover:border-[#0e1d54]
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput'; //FormInput.displayName = 'FormInput'; is used to manually set the display name of a React component — especially useful when the component is created using React.forwardRef or other higher-order functions.

// Create a FormTextarea component for textarea fields
export const FormTextarea = React.forwardRef(
  (
    {
      name,
      value,
      onChange,
      placeholder,
      label,
      error,
      optional = false,
      rows = 3,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-[#0e1d54] font-poppins">
            {label}
            {optional && <span className="text-xs text-muted-foreground ml-1">(optional)</span>}
          </label>
        )}
        <textarea
          ref={ref}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`
          w-full 
          font-poppins 
          bg-white 
          text-[#0e1d54] 
          placeholder:text-gray-400 
          border 
          border-gray-300 
          rounded-lg 
          px-3 
          py-2 
          transition-all 
          duration-300
          focus:outline-none 
          focus:ring-2 
          focus:ring-[#0e1d54] 
          focus:border-transparent
          hover:border-[#0e1d54]
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
