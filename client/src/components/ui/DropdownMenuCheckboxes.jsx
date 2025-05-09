'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from './dropdown-menu';
import { Button } from './button';
import { Input } from './input';

export function DropdownMenuCheckboxes({ onVerificationChange }) {
  const [options, setOptions] = useState({
    driversLicense: false,
    SSS: false,
    nationalId: false,
    passport: false,
  });

  // Separate state for each ID number
  const [idNumbers, setIdNumbers] = useState({
    driversLicense: '',
    SSS: '',
    nationalId: '',
    passport: '',
  });

  const handleOptionChange = (key, checked) => {
    const newOptions = { ...options, [key]: checked };
    setOptions(newOptions);
    onVerificationChange?.(newOptions, idNumbers);
  };

  const handleIdNumberChange = (key, value) => {
    const newIdNumbers = { ...idNumbers, [key]: value };
    setIdNumbers(newIdNumbers);
    onVerificationChange?.(options, newIdNumbers);
  };

  return (
    <div className="space-y-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-full h-10 text-sm font-medium">
            Select Valid ID
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuCheckboxItem
            checked={options.driversLicense}
            onCheckedChange={(checked) => handleOptionChange('driversLicense', checked)}
          >
            Driver's License
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={options.SSS}
            onCheckedChange={(checked) => handleOptionChange('SSS', checked)}
          >
            SSS ID
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={options.nationalId}
            onCheckedChange={(checked) => handleOptionChange('nationalId', checked)}
          >
            National ID
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={options.passport}
            onCheckedChange={(checked) => handleOptionChange('passport', checked)}
          >
            Passport
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Driver's License Input */}
      {options.driversLicense && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Driver's License Number</label>
          <Input
            type="text"
            placeholder="Enter your driver's license number"
            value={idNumbers.driversLicense}
            onChange={(e) => handleIdNumberChange('driversLicense', e.target.value)}
            className="w-full"
            required
          />
          {!idNumbers.driversLicense && (
            <p className="text-sm text-red-500">Driver's license number is required</p>
          )}
        </div>
      )}

      {/* SSS ID Input */}
      {options.SSS && (
        <div className="space-y-2">
          <label className="text-sm font-medium">SSS ID Number</label>
          <Input
            type="text"
            placeholder="Enter your SSS ID number"
            value={idNumbers.SSS}
            onChange={(e) => handleIdNumberChange('SSS', e.target.value)}
            className="w-full"
            required
          />
          {!idNumbers.SSS && <p className="text-sm text-red-500">SSS ID number is required</p>}
        </div>
      )}

      {/* National ID Input */}
      {options.nationalId && (
        <div className="space-y-2">
          <label className="text-sm font-medium">National ID Number</label>
          <Input
            type="text"
            placeholder="Enter your national ID number"
            value={idNumbers.nationalId}
            onChange={(e) => handleIdNumberChange('nationalId', e.target.value)}
            className="w-full"
            required
          />
          {!idNumbers.nationalId && (
            <p className="text-sm text-red-500">National ID number is required</p>
          )}
        </div>
      )}

      {/* Passport Input */}
      {options.passport && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Passport Number</label>
          <Input
            type="text"
            placeholder="Enter your passport number"
            value={idNumbers.passport}
            onChange={(e) => handleIdNumberChange('passport', e.target.value)}
            className="w-full"
            required
          />
          {!idNumbers.passport && (
            <p className="text-sm text-red-500">Passport number is required</p>
          )}
        </div>
      )}
    </div>
  );
}

export default DropdownMenuCheckboxes;
