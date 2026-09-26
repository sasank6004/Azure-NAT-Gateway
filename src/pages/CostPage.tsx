import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Clock,
  HardDrive,
  Calculator,
  Info,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import type { CostResponse } from '../types';

interface CostPageProps {
  costData: CostResponse | null;
}

export const CostPage: React.FC<CostPageProps> = ({ costData }) => {
  if (!costData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-400 border border-blue-500/30">
              MICROSOFT COST MANAGEMENT
            </span>
            <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono px-2 py-0.2">
              DEMO / SIMULATED DATA
            </span>
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Cost Analysis & Forecasting
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
            Transparent breakdown of Azure NAT Gateway operational costs based on resource hourly uptime and processed outbound data volume.
          </p>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-slate-400">Current Month Accrued</div>
          <div className="text-2xl font-extrabold text-white font-mono">
            ${costData.current_month_cost.toFixed(2)} USD
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Current Month Cost"
          value={`$${costData.current_month_cost.toFixed(2)}`}
          subtitle="Accrued spend to date"
          icon={DollarSign}
          statusColor="azure"
        />

        <KpiCard
          title="Estimated Monthly Cost"
          value={`$${costData.estimated_monthly_cost.toFixed(2)}`}
          subtitle="Forecast at current egress rate"
          icon={TrendingUp}
          statusColor="cyan"
        />

        <KpiCard
          title="NAT Gateway Hours"
          value={`${costData.nat_gateway_hours} hrs`}
          subtitle="Billed at $0.045 / resource-hour"
          icon={Clock}
          statusColor="emerald"
        />

        <KpiCard
          title="Data Processed"
          value={`${costData.data_processed_gb.toFixed(1)} GB`}
          subtitle="Billed at $0.045 / GB processed"
          icon={HardDrive}
          statusColor="violet"
        />
      </div>

      {/* Pricing Formula Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
          <Calculator className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">Official Azure NAT Gateway Pricing Model</h3>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
              1. Gateway Resource Charge
            </div>
            <div className="mt-1 text-lg font-bold text-white font-mono">$0.045 / hour</div>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Standard flat hourly fee per provisioned NAT Gateway resource. Covers multi-zone fabric redundancy and dynamic SNAT scaling across attached subnets.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
              2. Data Processing Charge
            </div>
            <div className="mt-1 text-lg font-bold text-white font-mono">$0.045 / GB processed</div>
            <p className="mt-2 text-xs text-emerald-300/80 leading-relaxed">
              Incurred only for data that actually traverses the NAT Gateway going outbound to internet destinations. Intra-VNet and peering traffic is not billed.
            </p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown & Daily Spend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Detailed Invoice Breakdown Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white">Month-to-Date Cost Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Itemized telemetry accounting</p>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800/80">
              <div>
                <div className="font-semibold text-white">NAT Gateway Hours</div>
                <div className="text-[11px] text-slate-400">410.0 hrs @ $0.045/hr</div>
              </div>
              <span className="font-mono font-bold text-cyan-400">${costData.gateway_cost.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800/80">
              <div>
                <div className="font-semibold text-white">Data Processing Charge</div>
                <div className="text-[11px] text-slate-400">284.6 GB @ $0.045/GB</div>
              </div>
              <span className="font-mono font-bold text-emerald-400">
                ${costData.data_processing_cost.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800/80">
              <div>
                <div className="font-semibold text-white">Public IP Addresses (2x)</div>
                <div className="text-[11px] text-slate-400">Standard Static IPv4</div>
              </div>
              <span className="font-mono font-bold text-blue-400">$7.20</span>
            </div>

            <div className="flex items-center justify-between text-sm pt-2 font-bold text-white">
              <span>Total Accrued Cost</span>
              <span className="text-base text-cyan-400 font-mono">
                ${costData.current_month_cost.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        {/* Right: Daily Cost Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white">7-Day Daily Cost Trend (USD)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Gateway base hourly spend vs data processing charges</p>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData.daily_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" $" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="gateway_cost" name="Gateway Base ($)" fill="#0284c7" stackId="a" />
                <Bar dataKey="data_cost" name="Data Processing ($)" fill="#10b981" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
