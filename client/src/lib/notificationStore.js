import { create } from "zustand";
import { getNotificationNumber } from "../api/user";

export const useNotificationStore = create((set) => ({
  number: 0,

  fetch: async () => {
    const res = await getNotificationNumber();
    set({ number: res.number });
  },
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },

  reset: () => {
    set({ number: 0 });
  },
}));
