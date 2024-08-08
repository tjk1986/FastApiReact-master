// src/zustand/store.js
import { produce } from "immer";

const initialState = {
  error: false,
  errorData: null,
};

export const createErrorSlice = (set, get) => ({
  ...initialState,

  removeError: (payload, index) =>
    set(
      produce((draft) => {
        draft.error = false;
        draft.error = null;
      })
    ),
});
