// src/zustand/store.js
import { create } from "zustand";
import { createFileSlice } from "./fileSlice";
import { createSettingsSlice } from "./settingsSlice";
import { createErrorSlice } from "./errorSlice";

export const useGetData = create((...a) => ({
  ...createFileSlice(...a),
  ...createSettingsSlice(...a),
  ...createErrorSlice(...a),
}));

window.store = useGetData;
