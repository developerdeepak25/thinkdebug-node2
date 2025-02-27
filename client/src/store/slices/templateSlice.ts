import { StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type TemplateType = {
  name: string;
  variables: string[];
  content: string;
};

interface TemplateStore {
  template: TemplateType;
  addTemplate: (template: TemplateType) => void;
  updateTemplate: (update: Partial<TemplateType>) => void;
}

const createTemplateSlice: StateCreator<
  TemplateStore,
  [],
  [["zustand/persist", TemplateStore]]
> = persist(
  (set) => ({
    template: {
      name: "",
      variables: [],
      content: "",
    },
    addTemplate: (template) => set({ template }),
    //exprected updateTemplate({name | variables | content: 'newValue'})
    updateTemplate: (update) =>
      set((state) => ({ template: { ...state.template, ...update } })),
  }),
  {
    name: "template-storage", // Key for localStorage
  }
);

export default createTemplateSlice;

export type { TemplateStore };
