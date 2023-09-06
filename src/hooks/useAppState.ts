import { create } from "zustand";

interface AppState {
  balance_lamports: number | null;
  set: (partial: Partial<AppState>) => void;
}

export const useAppState = create<AppState>()((set) => ({
  balance_lamports: null,
  set,
}));
