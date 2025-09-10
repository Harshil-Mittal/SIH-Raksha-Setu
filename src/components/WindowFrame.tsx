import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useUIStore, { WindowConfig } from '@/state/uiStore';

interface WindowFrameProps {
  window: WindowConfig;
}

const WindowFrame: React.FC<WindowFrameProps> = ({ window }) => {
  const { closeWindow, bringToFront, updateWindowPosition, updateWindowSize, minimizeWindow } = useUIStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPos: { x: number; y: number } }>({
    startX: 0,
    startY: 0,
    startPos: { x: 0, y: 0 },
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.window-header')) {
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPos: window.position,
      };
      bringToFront(window.id);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      updateWindowPosition(window.id, {
        x: dragRef.current.startPos.x + deltaX,
        y: dragRef.current.startPos.y + deltaY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  if (window.minimized) return null;

  const overlayRoot = document.getElementById('overlay-root');
  if (!overlayRoot) return null;

  return createPortal(
    <div
      className="absolute bg-background border border-border rounded-lg shadow-elevated"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
      }}
      onClick={() => bringToFront(window.id)}
    >
      <div
        className="window-header flex items-center justify-between p-3 border-b border-border cursor-move bg-muted/50"
        onMouseDown={handleMouseDown}
      >
        <h3 className="font-medium text-sm">{window.title}</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => minimizeWindow(window.id)}>
            <Minimize2 className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => closeWindow(window.id)}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <div className="p-4 h-[calc(100%-60px)] overflow-auto">
        {/* Window content will be rendered here based on window.component */}
        <div className="text-center text-muted-foreground">
          <p>{window.component} content goes here</p>
          <p className="text-sm mt-2">Window ID: {window.id}</p>
        </div>
      </div>
    </div>,
    overlayRoot
  );
};

export default WindowFrame;