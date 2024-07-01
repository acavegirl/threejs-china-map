import { create } from 'zustand'

export interface LayerInfo {
  id: string;
  type: string;
}

interface LayerState {
  id: string;
  type: string;
  setLayerInfo: (info: LayerInfo) => void
}

export const useLayerStore = create<LayerState>()((set) =>({
    id: 'map',
    type: 'map',
    setLayerInfo: (info) => {
      return set(() => ({
        id: info.id,
        type: info.type
      })
    )},
  })
)