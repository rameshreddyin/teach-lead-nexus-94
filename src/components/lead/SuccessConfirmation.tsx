
import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuccessConfirmationProps {
  message: string;
  subMessage?: string;
  autoCloseDelay?: number; // in milliseconds
  onClose?: () => void;
}

export const SuccessConfirmation: React.FC<SuccessConfirmationProps> = ({
  message,
  subMessage,
  autoCloseDelay = 2000,
  onClose,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (autoCloseDelay) {
      const timeout = setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          navigate('/');
        }
      }, autoCloseDelay);
      
      return () => clearTimeout(timeout);
    }
  }, [autoCloseDelay, onClose, navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-xs w-full m-4 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-app-success rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{message}</h2>
          {subMessage && (
            <p className="text-app-mediumGray mb-4">{subMessage}</p>
          )}
          <button 
            onClick={() => {
              if (onClose) {
                onClose();
              } else {
                navigate('/');
              }
            }}
            className="mt-2 text-app-black hover:underline"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
