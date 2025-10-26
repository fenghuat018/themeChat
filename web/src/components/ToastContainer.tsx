import { useToastStore } from '../store/toast';

const colorByType = {
  info: 'border-brand-400 bg-slate-800/90 text-slate-100',
  success: 'border-emerald-400 bg-emerald-900/90 text-emerald-100',
  error: 'border-rose-500 bg-rose-900/90 text-rose-100',
};

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismissToast);

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-lg border-l-4 px-4 py-3 shadow-lg transition-all ${colorByType[toast.type]}`}
        >
          <div className="flex-1 text-sm leading-snug">{toast.message}</div>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            className="text-xs text-slate-200 hover:text-white"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
