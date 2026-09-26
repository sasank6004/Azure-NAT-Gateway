import React from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

interface ErrorBannerProps {
  message?: string;
  onRetry?: () => void;
  isBackendOffline?: boolean;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onRetry,
  isBackendOffline = false,
}) => {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-200">
              {isBackendOffline ? 'FastAPI Backend Connection Unavailable' : 'Telemetry Sync Notice'}
            </h4>
            <p className="mt-1 text-xs text-amber-300/80 leading-relaxed max-w-2xl">
              {message ||
                'Backend connection unavailable. Please check whether the FastAPI server is running (python backend/run.py on port 8000). The portal is currently operating in standalone interactive simulation mode with real-time responsive mock telemetry.'}
            </p>
            {isBackendOffline && (
              <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-700/60 w-fit">
                <Terminal className="h-3.5 w-3.5 text-blue-400" />
                <span>Command: python backend/run.py</span>
              </div>
            )}
          </div>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-lg bg-amber-500/20 px-3.5 py-2 text-xs font-medium text-amber-300 hover:bg-amber-500/30 transition-all border border-amber-500/40 cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    </div>
  );
};
