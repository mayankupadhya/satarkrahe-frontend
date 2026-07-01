import React from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  ShieldAlert,
  Smartphone,
  UserCheck,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface BankingDecisionProps {
  onNavigate: (page: string) => void;
}

const actions = [
  {
    title: "Manual Verification Required",
    desc: "Transfer the call to a verified fraud-control agent.",
    icon: UserCheck,
  },
  {
    title: "OTP Challenge",
    desc: "Trigger secondary identity verification before approval.",
    icon: Smartphone,
  },
  {
    title: "Transaction Hold",
    desc: "Keep the payment request on hold until identity is confirmed.",
    icon: Clock,
  },
];

export const BankingDecision: React.FC<BankingDecisionProps> = ({
  onNavigate,
}) => {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl font-bold">Banking Decision Engine</h1>
            <p className="text-sm text-slate-500">
              Converting AI risk into operational banking action
            </p>
          </div>

          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">
            Decision Required
          </span>
        </header>

        <section className="grid gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-500/30 bg-slate-900 p-7 lg:col-span-7"
          >
            <div className="flex items-start gap-5">
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                <ShieldAlert className="h-10 w-10 text-red-400" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
                  Transaction Status
                </p>
                <h2 className="mt-3 text-5xl font-bold leading-tight text-red-300">
                  ON HOLD
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
                  Payment approval is paused because the active caller voice
                  matches high-risk synthetic voice behavior.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Metric title="Caller Risk" value="Critical" danger />
              <Metric title="AI Confidence" value="98.2%" />
              <Metric title="Detection Time" value="8.4 sec" />
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-400" />
                <div>
                  <h3 className="font-semibold text-slate-100">
                    Reason for hold
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Synthetic harmonic pattern and pitch discontinuity were
                    detected during the first 10 seconds of the call. The
                    transaction should not proceed without additional identity
                    verification.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="font-semibold">Recommended Next Steps</h3>

              <div className="mt-5 space-y-3">
                {actions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <div
                      key={action.title}
                      className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                      <div>
                        <p className="text-sm font-semibold text-slate-200">
                          {action.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {action.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="font-semibold">Action Controls</h3>

              <div className="mt-5 grid gap-3">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-500/20">
                  <Smartphone className="h-4 w-4" />
                  Send OTP Challenge
                </button>

                <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 font-semibold text-slate-200 transition hover:border-cyan-500">
                  <UserCheck className="h-4 w-4" />
                  Transfer to Human Agent
                </button>

                <button className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-500/20">
                  <XCircle className="h-4 w-4" />
                  Reject Transaction
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="font-semibold text-emerald-300">
                    Fraud Prevention Impact
                  </p>
                  <p className="mt-2 text-sm text-emerald-100/80">
                    Potential fraudulent transfer prevented: ₹2,50,000
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate("home")}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Complete Investigation
                <FileText className="h-4 w-4" />
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
};

function Metric({
  title,
  value,
  danger = false,
}: {
  title: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p
        className={`mt-2 text-xl font-bold ${
          danger ? "text-red-400" : "text-slate-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}