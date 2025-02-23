import { StateCreator } from "zustand";

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

const createTemplateSlice: StateCreator<TemplateStore> = (set) => ({
  template: {
    name: "",
    variables: [],
    content: "",
  },
  addTemplate: (template) => set({ template }),
  //exprected updateTemplate({name | variables | content: 'newValue'})
  updateTemplate: (update) =>
    set((state) => ({ template: { ...state.template, ...update } })),
});

export default createTemplateSlice;

export type { TemplateStore };