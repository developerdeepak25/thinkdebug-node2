import { StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type TemplateType = {
  name: string;
  subject: string;
  variables: string[];
  content: string;
};

interface TemplateStore {
  template: TemplateType | null;
  addTemplate: (template: TemplateType) => void;
  updateTemplate: (update: Partial<TemplateType>) => void;
}

const createTemplateSlice: StateCreator<
  TemplateStore,
  [],
  [["zustand/persist", TemplateStore]]
> = persist(
  (set) => ({
    template: null,
    addTemplate: (template) => set({ template }),
    updateTemplate: (update) =>
      set((state) => {
        if (!state.template) return state;
        return { template: { ...state.template, ...update } };
      }),
  }),
  {
    name: "template-storage", // Key for localStorage
  }
);

export default createTemplateSlice;

export type { TemplateStore };
