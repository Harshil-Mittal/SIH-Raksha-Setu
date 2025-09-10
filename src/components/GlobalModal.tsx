import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GlobalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const GlobalModal: React.FC<GlobalModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayRoot = document.getElementById('overlay-root');
  if (!overlayRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full max-w-4xl bg-background border border-border rounded-lg shadow-elevated ${className}`}>
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6 max-h-[80vh] overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>,
    overlayRoot
  );
};

export default GlobalModal;