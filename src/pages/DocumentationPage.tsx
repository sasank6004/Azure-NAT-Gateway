import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Zap,
  Globe,
  DollarSign,
  Terminal,
  Code2,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

export const DocumentationPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const bicepCode = `# Deploy Azure NAT Gateway with Public IP and Subnet Association
resource publicIp 'Microsoft.Network/publicIPAddresses@2023-09-01' = {
  name: 'pip-nat-prod-eastus'
  location: 'eastus'
  sku: { name: 'Standard' }
  properties: {
    publicIPAllocationMethod: 'Static'
  }
}

resource natGateway 'Microsoft.Network/natGateways@2023-09-01' = {
  name: 'nat-gw-prod-eastus'
  location: 'eastus'
  sku: { name: 'Standard' }
  properties: {
    idleTimeoutInMinutes: 4
    publicIpAddresses: [
      { id: publicIp.id }
    ]
  }
}

resource subnet 'Microsoft.Network/virtualNetworks/subnets@2023-09-01' = {
  name: 'vnet-prod-eastus/frontend-subnet'
  properties: {
    addressPrefix: '10.0.1.0/24'
    natGateway: { id: natGateway.id }
  }
}`;

  const cliCode = `# 1. Create a Public IP for the NAT Gateway
az network public-ip create \\
  --resource-group rg-networking-prod \\
  --name pip-nat-prod-eastus \\
  --sku Standard \\
  --zone 1 2 3

# 2. Create the Azure NAT Gateway
az network nat gateway create \\
  --resource-group rg-networking-prod \\
  --name nat-gw-prod-eastus \\
  --public-ip-addresses pip-nat-prod-eastus \\
  --idle-timeout 4

# 3. Associate NAT Gateway with a Virtual Network Subnet
az network vnet subnet update \\
  --resource-group rg-networking-prod \\
  --vnet-name vnet-prod-eastus \\
  --name frontend-subnet \\
  --nat-gateway nat-gw-prod-eastus`;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-400 border border-blue-500/30">
            KNOWLEDGE BASE
          </span>
          <span className="text-xs text-slate-400 font-mono">Cloud Networking & SNAT Architecture</span>
        </div>
        <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Azure NAT Gateway Documentation
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
          Comprehensive technical guide explaining deterministic public outbound IP egress, SNAT port allocation mechanics, and prevention of SNAT exhaustion.
        </p>
      </div>

      {/* Chapter 1: What is Azure NAT Gateway? */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">1. What is Azure NAT Gateway?</h2>
            <p className="text-xs text-slate-400">Core concepts and service definition</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Azure Virtual Network NAT (Network Address Translation)</strong> is a fully managed, highly resilient cloud service that provides <strong>outbound-only</strong> internet connectivity for one or more subnets in an Azure Virtual Network.
        </p>

        <p className="text-xs text-slate-300 leading-relaxed">
          When associated with a subnet, all outbound traffic from resources inside that subnet automatically passes through the NAT Gateway. It uses the static Public IP addresses assigned to the gateway as the source IP, guaranteeing that external services always see consistent, predictable IP addresses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-xs font-bold text-cyan-400">Outbound-Only Security</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Inbound connections from the internet directly to private IPs are inherently blocked.
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-xs font-bold text-emerald-400">Dynamic SNAT Headroom</div>
            <div className="text-[11px] text-slate-400 mt-1">
              64,512 SNAT ports allocated dynamically per configured public IP address.
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-xs font-bold text-blue-400">Multi-Zone Fabric</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Built-in zone redundancy across Availability Zones with up to 50 Gbps throughput.
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: Why is Predictable Outbound Connectivity Important? */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">2. Why is Predictable Outbound Connectivity Important?</h2>
            <p className="text-xs text-slate-400">Business impact and security whitelisting</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Without a NAT Gateway, outbound traffic from Azure VMs or AKS pods typically uses <em>default outbound access</em>. This default routing uses random, transient public IPs from the Azure regional IP pool that change without notice.
        </p>

        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200/90 leading-relaxed space-y-2">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <span>Critical Real-World Scenarios Requiring Predictable Outbound IPs:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li><strong>Third-Party Financial & Payment Gateways:</strong> Providers like Stripe, Adyen, and banking APIs strictly require whitelisting static IPs on their firewalls.</li>
            <li><strong>Enterprise Partner B2B Firewalls:</strong> Corporate VPNs and legacy enterprise partners only accept ingress from verified corporate public IPs.</li>
            <li><strong>Database Cloud Firewalls:</strong> External databases (e.g. MongoDB Atlas, Snowflake) require whitelisted CIDRs for connection grants.</li>
            <li><strong>Auditability & Compliance:</strong> SOC2, PCI-DSS, and ISO 27001 require deterministic traceability for every egress packet leaving customer cloud perimeters.</li>
          </ul>
        </div>
      </section>

      {/* Chapter 3: What is SNAT and SNAT Port Exhaustion? */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">3. What is SNAT and SNAT Port Exhaustion?</h2>
            <p className="text-xs text-slate-400">Deep technical mechanics</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong>SNAT (Source Network Address Translation)</strong> translates a private IPv4 address (e.g. <code className="text-cyan-400 font-mono">10.0.1.14</code>) into a public IPv4 address (e.g. <code className="text-blue-400 font-mono">20.45.123.10</code>). To distinguish multiple private flows sharing the same public IP, the gateway assigns a distinct <strong>SNAT Port</strong> (between 1024 and 65535).
          </p>

          <p>
            Each public IP provides exactly <strong>64,512</strong> usable SNAT ports.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="font-bold text-white mb-2">The 4-Tuple Dynamic Allocation Advantage:</div>
            <p className="text-slate-400 leading-relaxed">
              Azure NAT Gateway manages port consumption using a 4-tuple key: <code className="font-mono text-cyan-300">(Source IP, Source Port, Destination IP, Destination Port)</code>.
              Because ports are not statically pre-allocated to individual VMs, any workload in the subnet can pull from the common pool of 129,024 ports on demand.
            </p>
          </div>

          <p>
            <strong>SNAT Port Exhaustion</strong> occurs when all ephemeral ports are occupied and no free port exists to establish a new outbound connection. When this occurs on legacy setups, new connections hang, timeout, or get dropped. Azure NAT Gateway eliminates this by maintaining high dynamic headroom and allowing seamless addition of extra public IPs.
          </p>
        </div>
      </section>

      {/* Chapter 4: Infrastructure as Code Snippets */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">4. Deployment Examples (Azure CLI & Bicep)</h2>
            <p className="text-xs text-slate-400">Production-ready templates for automated cloud deployment</p>
          </div>
        </div>

        {/* Azure CLI snippet */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pb-2">
            <span>Azure CLI Commands</span>
            <button
              onClick={() => handleCopy('cli', cliCode)}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              {copiedCode === 'cli' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode === 'cli' ? 'Copied!' : 'Copy CLI'}</span>
            </button>
          </div>
          <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto">
            {cliCode}
          </pre>
        </div>

        {/* Bicep snippet */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pb-2">
            <span>Azure Bicep / ARM Template</span>
            <button
              onClick={() => handleCopy('bicep', bicepCode)}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              {copiedCode === 'bicep' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode === 'bicep' ? 'Copied!' : 'Copy Bicep'}</span>
            </button>
          </div>
          <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 overflow-x-auto">
            {bicepCode}
          </pre>
        </div>
      </section>

      {/* Chapter 5: Cost Considerations */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">5. Cost Considerations</h2>
            <p className="text-xs text-slate-400">Budget planning and optimization</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          NAT Gateway pricing is strictly consumption-based: <strong>$0.045 per gateway hour</strong> (approx. $32.85/month for continuous uptime) plus <strong>$0.045 per GB</strong> of data processed. Standard static public IPs cost approximately $3.60/month each.
        </p>

        <p className="text-xs text-slate-400 leading-relaxed">
          To optimize costs, associate multiple subnets in the same VNet with a single NAT Gateway instead of creating separate gateways per subnet.
        </p>
      </section>
    </div>
  );
};
