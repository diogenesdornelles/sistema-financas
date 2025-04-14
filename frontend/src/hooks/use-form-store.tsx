import { create } from "zustand";
import { FormsState, TValue } from "../types/form-state";

export const useFormStore = create<FormsState & { forceUpdate: number; incrementForceUpdate: () => void }>((set) => ({
  forms: {
    cf: { type: "create", updateItem: null, isOpen: false },
    tcf: { type: "create", updateItem: null, isOpen: false },
    cr: { type: "create", updateItem: null, isOpen: false },
    tcr: { type: "create", updateItem: null, isOpen: false },
    cp: { type: "create", updateItem: null, isOpen: false },
    tcp: { type: "create", updateItem: null, isOpen: false },
    partner: { type: "create", updateItem: null, isOpen: false },
    tx: { type: "create", updateItem: null, isOpen: false },
    cat: { type: "create", updateItem: null, isOpen: false },
    user: { type: "create", updateItem: null, isOpen: false },
  },
  setIsOpen: (value: boolean, name: TValue) =>
    set((state) => ({
      forms: {
        ...state.forms,
        [name]: { ...state.forms[name], isOpen: value }
      },
    })),
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