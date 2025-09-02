import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebar: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebar: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
}));
