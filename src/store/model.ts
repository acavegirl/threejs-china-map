import { create } from 'zustand'

interface LabelModelState {
  modelList: any;
  setModelList: (data: any) => void
}

export const useLabelModelStore = create<LabelModelState>()((set) => ({
  modelList: null,
  setModelList: (modelList) => set(() => ({
    modelList,
  })),
}))