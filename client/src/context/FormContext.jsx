import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export function FormProvider({ children }) {
  const [buyerFormData, setBuyerFormData] = useState({
    // Step 1
    email: '',
    password: '',
    // Step 2
    name: '',
    phoneNumber: '',
    profilePic: '',
    bio: '',
    termsAccepted: false,
  });

  const [sellerFormData, setSellerFormData] = useState({
    // Step 1
    email: '',
    password: '',
    // Step 2
    name: '',
    phoneNumber: '',
    profilePic: '',
    bio: '',
    // Step 3
    verificationType: '',
    idNumber: '',
    sellingDescription: '',
    termsAccepted: false,
  });

  // Track which form is active
  const [activeForm, setActiveForm] = useState('buyer'); // or seller

  const updateFormData = (data) => {
    if (activeForm === 'buyer') {
      setBuyerFormData((prev) => ({
        ...prev,
        ...data,
      }));
    } else {
      setSellerFormData((prev) => ({
        ...prev,
        ...data,
      }));
    }
  };

  const switchForm = (type) => {
    setActiveForm(type);
  };

  const getFormData = () => {
    return activeForm === 'buyer' ? buyerFormData : sellerFormData;
  };

  return (
    <FormContext.Provider
      value={{
        formData: activeForm === 'buyer' ? buyerFormData : sellerFormData,
        updateFormData,
        getFormData,
        switchForm,
      }}
    >
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
