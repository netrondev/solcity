import { type Keypair } from "@solana/web3.js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface MyState {
  keypair: Keypair | null;
  keypair_secret: string | null;
  test: number;
  set: (state: Partial<MyState>) => void;
}

/** Persisted app state */
export const useAppState = create<MyState>()(
  persist(
    (set, get) => ({
      keypair: null,
      keypair_secret: null,
      test: 0,
      set,
    }),
    {
      name: "solcitystate", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
      // partialize: (state) => ({ bears: state.bears }),
    }
  )
);
