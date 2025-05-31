import React from 'react';
import { Button } from './button';

export function SocialLoginButton({ icon: Icon, text, onClick }) {
  return (
    <Button variant="outline" className="w-full font-poppins" onClick={onClick}>
      <div className="flex items-center justify-center">
        {Icon && <Icon className="w-5 h-5" />}
        <span className="ml-2">{text}</span>
      </div>
    </Button>
  );
}
