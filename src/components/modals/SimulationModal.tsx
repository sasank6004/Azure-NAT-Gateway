import React, { useState } from 'react';
import { X, Play, Square, Activity, Zap, AlertTriangle, Info, Clock, Gauge } from 'lucide-react';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSimulationActive: boolean;
  currentLoad: string;
  remainingSeconds: number;
  onStartSimulation: (load: string, duration: number) => Promise<void>;
  onStopSimulation: () => Promise<void>;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  isSimulationActive,
  currentLoad,
  remainingSeconds,
  onStartSimulation,
  onStopSimulation,
}) => {
  const [selectedLoad, setSelectedLoad] = useState<string>('Medium');
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStart = async () => {
    setIsSubmitting(true);
    try {
      await onStartSimulation(selectedLoad, selectedDuration);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStop = async () => {
    setIsSubmitting(true);
    try {
      await onStopSimulation();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadOptions = [
    {
      id: 'Low',
      title: 'Low Traffic Ramp',
      snatRange: '~48% SNAT',
      conns: '1,850 conns',
      throughput: '240 Mbps',
      desc: 'Simulates normal steady-state background outbound API traffic from frontend microservices.',
      color: 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/20 text-emerald-400',
    },
    {
      id: 'Medium',
      title: 'Medium Burst Load',
      snatRange: '~72% SNAT',
      conns: '3,980 conns',
      throughput: '410 Mbps',
      desc: 'Simulates peak business hours with third-party payment calls and container registry pulls.',
      color: 'border-amber-500/30 hover:border-amber-500/60 bg-amber-950/20 text-amber-400',
    },
    {
      id: 'High',
      title: 'High Stress Spike',
      snatRange: '~90% SNAT',
      conns: '8,450 conns',
      throughput: '720 Mbps',
      desc: 'Extreme batch egress burst. Crosses SNAT warning thresholds and triggers telemetry alert simulation.',
      color: 'border-rose-500/30 hover:border-rose-500/60 bg-rose-950/20 text-rose-400',
    },
  ];

  const durationOptions = [
    { label: '30 Seconds', value: 30 },
    { label: '60 Seconds', value: 60 },
    { label: '5 Minutes', value: 300 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>NAT Gateway Traffic Simulator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  DEMO / SIMULATED DATA
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Stress-test SNAT port allocation, connection headroom, and dynamic alert generation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current status if active */}
        {isSimulationActive && (
          <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-950/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                </span>
                <div>
                  <div className="text-xs font-semibold text-amber-200">
                    Simulation In Progress: <span className="uppercase">{currentLoad} Load</span>
                  </div>
                  <div className="text-[11px] text-amber-300/80">
                    {remainingSeconds > 0 ? `${remainingSeconds} seconds remaining in test run` : 'Finalizing metrics...'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleStop}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <Square className="h-3.5 w-3.5 fill-white" />
                <span>Stop Simulation</span>
              </button>
            </div>
          </div>
        )}

        {/* Load selection */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Select Outbound Traffic Intensity
            </label>
            <div className="mt-2.5 grid grid-cols-1 md:grid-cols-3 gap-3">
              {loadOptions.map((opt) => {
                const isSelected = selectedLoad === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedLoad(opt.id)}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{opt.title}</span>
                      <span className="text-[11px] font-mono font-semibold text-blue-400">{opt.snatRange}</span>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400 leading-snug">{opt.desc}</p>
                    <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{opt.conns}</span>
                      <span>{opt.throughput}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Duration selection */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Simulation Duration
            </label>
            <div className="mt-2 flex gap-3">
              {durationOptions.map((dur) => (
                <button
                  key={dur.value}
                  type="button"
                  onClick={() => setSelectedDuration(dur.value)}
                  className={`flex-1 rounded-xl border py-2 text-xs font-medium transition-all cursor-pointer ${
                    selectedDuration === dur.value
                      ? 'border-blue-500 bg-blue-600/20 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 inline mr-1.5 opacity-70" />
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* Architecture note */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-start gap-3">
            <Info className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When started, the backend generates burst egress telemetry across all 4 subnets, scales dynamic SNAT port consumption against the 129,024 capacity, records connection logs, and triggers realistic Azure Monitor alerts.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-500 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>{isSubmitting ? 'Starting...' : 'Run Network Simulation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
