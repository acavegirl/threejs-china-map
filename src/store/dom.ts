import { create } from 'zustand'

interface RefsInfo {
  leftRef: any;
  rightRef: any;
  right2Ref: any;
}

type RefState = {
  setRef: (refs: any) => void
} & RefsInfo

export const useDOMStore = create<RefState>()((set) => ({
  leftRef: null,
  rightRef: null,
  right2Ref: null,
  setRef: (refs: RefsInfo) => set(refs),
}))