import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export function FormProvider({ children }) {
  // Use a ref to store password instead of state
  let _password = '';

  const [formData, setFormData] = useState({
    // Step 1
    email: '',
    // Step 2
    name: '',
    phoneNumber: '',
    profilePic: '',
    bio: '',
    // Step 3
    address: '',
    city: '',
    // Step 4
    termsAccepted: false,
  });

  const updateFormData = (data) => {
    if ('password' in data) {
      // Store password in ref instead of state
      _password = data.password;

      // Remove password from data to prevent it from being stored in state
      const { password, ...restData } = data;
      setFormData((prev) => ({
        ...prev,
        ...restData,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    }
  };

  // Only get password when needed for submission
  const getFormData = () => ({
    ...formData,
    password: _password,
  });

  // Debug logs
  console.log('Current password state:', _password);
  console.log('Current formData state:', formData);

  return (
    <FormContext.Provider value={{ formData, updateFormData, getFormData }}>
      {children}
    </FormContext.Provider>
  );
}

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
