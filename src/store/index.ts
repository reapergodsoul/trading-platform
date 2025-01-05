import create from 'zustand';

interface StoreState {
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  toggleTheme: () => void;
  setAuthenticated: (value: boolean) => void;
}

const useStore = create<StoreState>((set) => ({
  theme: 'light',
  isAuthenticated: false,
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
}));

export default useStore;
