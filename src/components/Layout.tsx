import React from "react";
import {
  Activity,
  AlertTriangle,
  Banknote,
  Brain,
  Home,
  Radio,
  ShieldCheck,
} from "lucide-react";

interface LayoutProps {
  currentPage: string;
  children: React.ReactNode;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "home", label: "Dashboard", icon: Home },
  { id: "monitor", label: "Live Monitoring", icon: Radio },
  { id: "analysis", label: "AI Analysis", icon: Brain },
  { id: "result", label: "Detection", icon: AlertTriangle },
  { id: "evidence", label: "Evidence", icon: Activity },
  { id: "decision", label: "Decision", icon: Banknote },
];

export const Layout: React.FC<LayoutProps> = ({
  currentPage,
  children,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-950 p-5 lg:block">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-400/10 p-2">
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-bold">SatarkRahe.ai</h1>
              <p className="text-xs text-slate-500">Voice Fraud Platform</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs text-slate-500">PSB Hackathon 2026</p>
          <p className="mt-1 text-sm font-semibold text-slate-300">
            AI Audio Forensics
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Case SBI-2026-08421</p>
              <p className="text-xs text-slate-500">
                Officer: Demo User · Session: Live
              </p>
            </div>

            <div className="flex gap-3">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                AI Engine Active
              </span>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                Secure Call Stream
              </span>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
};