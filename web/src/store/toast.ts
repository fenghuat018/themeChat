import { create } from 'zustand';

export type ToastType = 'info' | 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  pushToast: (toast: { message: string; type?: ToastType; duration?: number }) => void;
  dismissToast: (id: string) => void;
}

const generateId = () => Math.random().toString(36).slice(2, 10);

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  pushToast({ message, type = 'info', duration = 4000 }) {
    const id = generateId();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    window.setTimeout(() => get().dismissToast(id), duration);
  },
  dismissToast(id) {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  },
}));
