import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { usePathname } from 'next/navigation';

// Form types based on sidebar menu items
type FormType = 'vehicle' | 'subscription' | 'bill' | 'password' | 'wifi' | 
                'insurance' | 'savings' | 'general';

interface FormContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  currentFormType: FormType;
  saveFormData: (formData: any) => void;
  formSubmitting: boolean;
  formSuccess: boolean;
  formError: string | null;
  resetFormState: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const pathname = usePathname();

  // Determine the form type based on the current path
  const getFormType = (): FormType => {
    const path = pathname || '/';
    
    if (path.includes('vehicles')) return 'vehicle';
    if (path.includes('subscriptions')) return 'subscription';
    if (path.includes('bills')) return 'bill';
    if (path.includes('passwords')) return 'password';
    if (path.includes('wifi')) return 'wifi';
    if (path.includes('insurance')) return 'insurance';
    if (path.includes('savings')) return 'savings';
    
    // Default to general form
    return 'general';
  };

  const openModal = () => {
    resetFormState();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Small delay to allow close animation to finish before resetting form state
    setTimeout(() => {
      resetFormState();
    }, 300);
  };

  const resetFormState = () => {
    setFormSubmitting(false);
    setFormSuccess(false);
    setFormError(null);
  };

  // Save form data to localStorage based on form type
  const saveFormData = useCallback(async (formData: any) => {
    const formType = getFormType();
    setFormSubmitting(true);
    setFormError(null);
    
    try {
      // Add unique ID and timestamp to the data
      const enhancedData = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      // Different localStorage keys for different data types
      const storageKey = getStorageKeyForFormType(formType);
      const existingData = localStorage.getItem(storageKey);
      let newData = [];
      
      if (existingData) {
        try {
          const parsedData = JSON.parse(existingData);
          newData = Array.isArray(parsedData) ? [...parsedData, enhancedData] : [enhancedData];
        } catch (e) {
          newData = [enhancedData];
        }
      } else {
        newData = [enhancedData];
      }
      
      localStorage.setItem(storageKey, JSON.stringify(newData));
      
      // Simulate a small delay for better UX
      setTimeout(() => {
        setFormSubmitting(false);
        setFormSuccess(true);
        
        // Auto close the modal after success
        setTimeout(() => {
          closeModal();
        }, 1000);
      }, 500);
    } catch (error) {
      console.error('Error saving form data:', error);
      setFormSubmitting(false);
      setFormError('Failed to save data. Please try again.');
    }
  }, [pathname]);

  // Helper to get the correct localStorage key
  const getStorageKeyForFormType = (formType: FormType): string => {
    switch (formType) {
      case 'vehicle': return 'vehicles';
      case 'subscription': return 'subscriptions';
      case 'bill': return 'bills';
      case 'password': return 'passwords';
      case 'wifi': return 'wifiNetworks';
      case 'insurance': return 'insurancePolicies';
      case 'savings': return 'savingsGoals';
      default: return 'generalItems';
    }
  };

  return (
    <FormContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal,
        currentFormType: getFormType(),
        saveFormData,
        formSubmitting,
        formSuccess,
        formError,
        resetFormState
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export default FormContext; 