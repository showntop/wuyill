import { create } from 'zustand'

interface ToolboxState {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

export const useToggleToolbox = create<ToolboxState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false })
}))
