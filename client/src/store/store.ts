import { create } from "zustand";
import createTemplateSlice, { TemplateStore } from "./slices/templateSlice";

type StoreState = TemplateStore;

const useStore = create<StoreState>((...a) => ({
  ...createTemplateSlice(...a),
}));

export default useStore;
