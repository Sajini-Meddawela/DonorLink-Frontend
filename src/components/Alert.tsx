// Alert.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

// Types
type AlertVariant = 'success' | 'warning' | 'error' | 'info';
type AlertPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface AlertProps {
  title?: string;
  message: string;
  variant?: AlertVariant;
  isOpen: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
  position?: AlertPosition;
  showIcon?: boolean;
}

// Constants
const ALERT_VARIANTS = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-800',
    icon: CheckCircle
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    text: 'text-yellow-800',
    icon: AlertTriangle
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-800',
    icon: XCircle
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-800',
    icon: AlertCircle
  }
} as const;

const POSITIONS = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
} as const;

const Alert: React.FC<AlertProps> = ({
  title,
  message,
  variant = 'info',
  isOpen,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
  position = 'top-right',
  showIcon = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Animation duration
  }, [onClose]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (autoClose && isVisible) {
      timeoutId = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [autoClose, isVisible, autoCloseTime, handleClose]);

  const getAlertStyles = (): string => {
    const baseStyles = 'fixed z-50 min-w-[320px] max-w-[420px] transform transition-all duration-300 ease-in-out';
    const variantStyles = ALERT_VARIANTS[variant];
    const positionStyle = POSITIONS[position];
    const visibilityStyles = isVisible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-2';

    return `${baseStyles} ${variantStyles.bg} ${variantStyles.border} ${variantStyles.text} ${positionStyle} ${visibilityStyles}`;
  };

  if (!isOpen && !isVisible) return null;

  const Icon = ALERT_VARIANTS[variant].icon;

  return (
    <div
      role="alert"
      className={`${getAlertStyles()} flex items-start p-4 border rounded-lg shadow-lg`}
      aria-labelledby={title ? 'alert-title' : undefined}
    >
      {showIcon && (
        <div className="flex-shrink-0 mr-3">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 
            id="alert-title"
            className="text-sm font-medium mb-1"
          >
            {title}
          </h4>
        )}
        <p className="text-sm break-words">
          {message}
        </p>
      </div>

      <button
        onClick={handleClose}
        className={`flex-shrink-0 ml-3 hover:${ALERT_VARIANTS[variant].text} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded`}
        aria-label="Close alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Alert;