import { create } from 'zustand'

interface LoadingState {
  loading: boolean;
  setLoading: (loading: boolean) => void
}

export const useLoadingStore = create<LoadingState>()((set) => ({
  loading: true,
  setLoading: (loading) => set(() => ({
    loading,
  })),
}))