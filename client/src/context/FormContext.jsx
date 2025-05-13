import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [activeForm, setActiveForm] = useState('buyer');

  const updateFormData = (data) => {
    console.log('Updating form data:', { activeForm, data }); // Debug log
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
    console.log('Switching form to:', type); // Debug log
    if (type === 'buyer' || type === 'seller') {
      setActiveForm(type);
    }
  };

  // Debug effect to log state changes
  useEffect(() => {
    console.log('Form state updated:', {
      activeForm,
      buyerFormData,
      sellerFormData,
    });
  }, [activeForm, buyerFormData, sellerFormData]);

  const getFormData = () => {
    return activeForm === 'buyer' ? buyerFormData : sellerFormData;
  };

  // Add a function to reset form data
  const resetFormData = () => {
    setBuyerFormData({
      email: '',
      password: '',
      name: '',
      phoneNumber: '',
      profilePic: '',
      bio: '',
      termsAccepted: false,
    });
    setSellerFormData({
      email: '',
      password: '',
      name: '',
      phoneNumber: '',
      profilePic: '',
      bio: '',
      verificationType: '',
      idNumber: '',
      sellingDescription: '',
      termsAccepted: false,
    });
    setActiveForm('buyer');
  };

  return (
    <FormContext.Provider
      value={{
        formData: activeForm === 'buyer' ? buyerFormData : sellerFormData,
        updateFormData,
        getFormData,
        switchForm,
        resetFormData,
        activeForm,
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
