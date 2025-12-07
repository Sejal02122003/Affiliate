import React from 'react';
import { Toaster } from 'sonner';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      {children}
    </>
  );
};

export default ToastProvider;
