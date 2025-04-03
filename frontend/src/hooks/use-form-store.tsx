import { create } from "zustand";
import { FormsState } from "../types/form-state";

export const useFormStore = create<FormsState & { forceUpdate: number; incrementForceUpdate: () => void }>((set) => ({
  forms: {
    cf: { type: "create", updateItem: null },
    tcf: { type: "create", updateItem: null },
    cr: { type: "create", updateItem: null },
    tcr: { type: "create", updateItem: null },
    cp: { type: "create", updateItem: null },
    tcp: { type: "create", updateItem: null },
    partner: { type: "create", updateItem: null },
    tx: { type: "create", updateItem: null },
    cat: { type: "create", updateItem: null },
    user: { type: "create", updateItem: null },
  },
  setFormType: (key, type) =>
    set((state) => ({
      forms: {
        ...state.forms,
        [key]: { ...state.forms[key], type },
      },
    })),
  setUpdateItem: (key, item) =>
    set((state) => ({
      forms: {
        ...state.forms,
        [key]: { ...state.forms[key], updateItem: item },
      },
    })),
  forceUpdate: 0,
  incrementForceUpdate: () =>
    set((state) => ({
      forceUpdate: state.forceUpdate + 1,
    })),
}));