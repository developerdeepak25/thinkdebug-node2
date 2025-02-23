import { create } from "zustand";
import createTemplateSlice, { TemplateStore } from "./slices/TemplateSlice";


type StoreState  = TemplateStore


const useStore  = create<StoreState>((...a) => ({
    ...createTemplateSlice(...a),
}))

export default useStore