import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
          error: <AlertCircle className="h-5 w-5 text-rose-400" />,
          info: <Info className="h-5 w-5 text-blue-400" />,
        };

        const borderColors = {
          success: 'border-emerald-500/30 bg-slate-900/95',
          error: 'border-rose-500/30 bg-slate-900/95',
          info: 'border-blue-500/30 bg-slate-900/95',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${borderColors[toast.type]}`}
          >
            <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-semibold text-white tracking-wide">{toast.title}</h5>
              {toast.message && <p className="mt-0.5 text-xs text-slate-300">{toast.message}</p>}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
