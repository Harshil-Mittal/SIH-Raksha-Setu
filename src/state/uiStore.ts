import { create } from 'zustand';

export interface WindowConfig {
  id: string;
  title: string;
  component: string;
  props?: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  minimized?: boolean;
}

interface UIState {
  openWindows: WindowConfig[];
  globalModalOpen: string | null;
  cardsDisabled: boolean;
  maxZIndex: number;
  
  // Window management
  openWindow: (window: Omit<WindowConfig, 'zIndex'>) => void;
  closeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  minimizeWindow: (id: string) => void;
  
  // Global modal management
  openGlobalModal: (modalId: string) => void;
  closeGlobalModal: () => void;
  
  // Cards management
  setCardsDisabled: (disabled: boolean) => void;
}

const useUIStore = create<UIState>((set, get) => ({
  openWindows: [],
  globalModalOpen: null,
  cardsDisabled: false,
  maxZIndex: 1000,

  openWindow: (window) => {
    const { openWindows, maxZIndex } = get();
    const newZIndex = maxZIndex + 1;
    
    // Check if window already exists
    const existingIndex = openWindows.findIndex(w => w.id === window.id);
    if (existingIndex >= 0) {
      // Bring existing window to front
      get().bringToFront(window.id);
      return;
    }

    const newWindow: WindowConfig = {
      ...window,
      zIndex: newZIndex,
    };

    set({
      openWindows: [...openWindows, newWindow],
      maxZIndex: newZIndex,
    });
  },

  closeWindow: (id) => {
    set((state) => ({
      openWindows: state.openWindows.filter(w => w.id !== id),
    }));
  },

  bringToFront: (id) => {
    const { openWindows, maxZIndex } = get();
    const windowIndex = openWindows.findIndex(w => w.id === id);
    
    if (windowIndex === -1) return;

    const newZIndex = maxZIndex + 1;
    const updatedWindows = [...openWindows];
    updatedWindows[windowIndex] = {
      ...updatedWindows[windowIndex],
      zIndex: newZIndex,
      minimized: false,
    };

    set({
      openWindows: updatedWindows,
      maxZIndex: newZIndex,
    });
  },

  updateWindowPosition: (id, position) => {
    set((state) => ({
      openWindows: state.openWindows.map(w =>
        w.id === id ? { ...w, position } : w
      ),
    }));
  },

  updateWindowSize: (id, size) => {
    set((state) => ({
      openWindows: state.openWindows.map(w =>
        w.id === id ? { ...w, size } : w
      ),
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      openWindows: state.openWindows.map(w =>
        w.id === id ? { ...w, minimized: !w.minimized } : w
      ),
    }));
  },

  openGlobalModal: (modalId) => {
    set({
      globalModalOpen: modalId,
      cardsDisabled: true,
    });
  },

  closeGlobalModal: () => {
    set({
      globalModalOpen: null,
      cardsDisabled: false,
    });
  },

  setCardsDisabled: (disabled) => {
    set({ cardsDisabled: disabled });
  },
}));

export default useUIStore;