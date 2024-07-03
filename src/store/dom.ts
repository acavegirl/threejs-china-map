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

interface PopRefState {
  popDOMRef: any;
  setRef: (ref: any) => void
}
export const usePopDOMStore = create<PopRefState>()((set) => ({
  popDOMRef: null,
  setRef: (ref) => set(()=>({
    popDOMRef: ref
  }))
}))