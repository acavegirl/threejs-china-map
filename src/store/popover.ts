import { create } from 'zustand'

interface PopoverData {
  name: string;
  data: string;
}

interface PopoverState {
  popoverData: PopoverData;
  setPopoverData: (data: PopoverData) => void
}

export const usePopoverStore = create<PopoverState>()((set) => ({
  popoverData: {
    name: 'shanghai',
    data: '1111111',
  },
  setPopoverData: (data: PopoverData) => set(() => ({
    popoverData: data
  })),
}))