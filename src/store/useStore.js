import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  expenses: [],
  setExpenses: (expenses) => set({ expenses }),
  selectedExpense: null,
  setSelectedExpense: (expense) => set({ selectedExpense: expense }),
}));

export default useStore;