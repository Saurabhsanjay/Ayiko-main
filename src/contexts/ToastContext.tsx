// contexts/ToastContext.tsx
import React, {createContext, useState, useContext, ReactNode} from 'react';

type ToastContextType = {
  showToast: (message: string) => void;
  toastMessage: string;
  toastVisible: boolean;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({children}) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const hideToast = () => setToastVisible(false);

  return (
    <ToastContext.Provider
      value={{showToast, toastMessage, toastVisible, hideToast}}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
