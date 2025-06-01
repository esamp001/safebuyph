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
    // Uncheck all other options
    const newOptions = {
      driversLicense: false,
      SSS: false,
      nationalId: false,
      passport: false,
      [key]: checked,
    };
    setOptions(newOptions);

    // Clear other ID numbers when switching options
    const newIdNumbers = {
      driversLicense: '',
      SSS: '',
      nationalId: '',
      passport: '',
      [key]: idNumbers[key],
    };
    setIdNumbers(newIdNumbers);

    onVerificationChange?.(newOptions, newIdNumbers);
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
          <Button
            variant="outline"
            size="sm"
            className="w-full h-10 text-sm font-medium bg-[#597aaf] hover:bg-[#415C87] text-[#FFFF] hover:text-[#FFFF] font-poppins"
          >
            Select Valid ID
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[490px]">
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

      {/* Show input fields for selected ID */}
      {Object.entries(options).map(([key, checked]) => {
        if (checked) {
          return (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium font-poppins text-[#0e1d54]">
                {key === 'driversLicense'
                  ? "Driver's License"
                  : key === 'SSS'
                    ? 'SSS ID'
                    : key === 'nationalId'
                      ? 'National ID'
                      : 'Passport'}{' '}
                Number
              </label>
              <Input
                type="text"
                placeholder={`Enter your ${
                  key === 'driversLicense'
                    ? "driver's license"
                    : key === 'SSS'
                      ? 'SSS ID'
                      : key === 'nationalId'
                        ? 'national ID'
                        : 'passport'
                } number`}
                value={idNumbers[key]}
                onChange={(e) => handleIdNumberChange(key, e.target.value)}
                className="w-full bg-white"
                required
              />
              {!idNumbers[key] && (
                <p className="text-sm text-red-500">
                  {key === 'driversLicense'
                    ? "Driver's license"
                    : key === 'SSS'
                      ? 'SSS ID'
                      : key === 'nationalId'
                        ? 'National ID'
                        : 'Passport'}{' '}
                  number is required
                </p>
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default DropdownMenuCheckboxes;
