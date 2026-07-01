import React from "react";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  ShieldAlert,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import type { BackendDetectionResponse } from "../services/api";

interface DetectionResultsProps {
  onNavigate: (page: string) => void;
  result: BackendDetectionResponse | null;
}

export const DetectionResults: React.FC<DetectionResultsProps> = ({
  onNavigate,
  result,
}) => {
  const data: BackendDetectionResponse = result ?? {
    success: true,
    fileName: "demo_fake.wav",
    label: "FAKE",
    risk: "HIGH",
    score: 87,
    confidence: 87,
    message: "Possible AI-generated / cloned voice detected",
    recommendedAction: "Block sensitive transaction and alert agent",
    detectionMethod: "CNN + Wav2Vec2 + Ensemble Voting",
    timestamp: new Date().toISOString(),
  };

  const isFake = data.label === "FAKE";

  const reasons = isFake
    ? [
        "Pitch discontinuity",
        "Synthetic harmonic pattern",
        "Frequency smoothing",
        "Missing natural breathing pauses",
      ]
    : [
        "Natural pitch variation detected",
        "No synthetic harmonic pattern",
        "Normal frequency transitions",
        "Natural breathing pauses present",
      ];

  const actions = isFake
    ? [
        data.recommendedAction,
        "Trigger manual verification",
        "Send OTP challenge",
      ]
    : [
        data.recommendedAction,
        "Continue standard verification",
        "No fraud escalation required",
      ];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl font-bold">AI Detection Result</h1>
            <p className="text-sm text-slate-500">
              Backend response received from Spring Boot /api/analyze
            </p>
          </div>

          <span
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              isFake
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {isFake ? "Critical Threat" : "Low Risk"}
          </span>
        </header>

        <section className="grid gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border bg-slate-900 p-7 lg:col-span-7 ${
              isFake ? "border-red-500/30" : "border-emerald-500/30"
            }`}
          >
            <div className="flex items-start gap-5">
              <div
                className={`rounded-2xl border p-4 ${
                  isFake
                    ? "border-red-500/30 bg-red-500/10"
                    : "border-emerald-500/30 bg-emerald-500/10"
                }`}
              >
                {isFake ? (
                  <ShieldAlert className="h-9 w-9 text-red-400" />
                ) : (
                  <ShieldCheck className="h-9 w-9 text-emerald-400" />
                )}
              </div>

              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-widest ${
                    isFake ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {isFake ? "Voice Clone Detected" : "Voice Verified"}
                </p>

                <h2 className="mt-3 text-4xl font-bold leading-tight">
                  {isFake ? "High Risk Banking Call" : "Genuine Voice Detected"}
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
                  {data.message}
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  File: {data.fileName} · Method: {data.detectionMethod}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Metric
                title="Risk Score"
                value={`${data.score}%`}
                danger={isFake}
              />
              <Metric title="Confidence" value={`${data.confidence}%`} />
              <Metric title="Backend Label" value={data.label} />
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Threat Scale</span>
                <span
                  className={`font-semibold ${
                    isFake ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {isFake ? "CRITICAL" : "LOW"}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {["Low", "Medium", "High", "Critical"].map((level, idx) => {
                  const activeBars = isFake ? 4 : 1;

                  return (
                    <div key={level}>
                      <div
                        className={`h-3 rounded-full ${
                          idx < activeBars
                            ? isFake
                              ? idx < 3
                                ? "bg-amber-400"
                                : "bg-red-500"
                              : "bg-emerald-400"
                            : "bg-slate-800"
                        }`}
                      />
                      <p className="mt-2 text-xs text-slate-500">{level}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <div className="space-y-6 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="font-semibold">
                {isFake ? "Why was this flagged?" : "Why was this verified?"}
              </h3>

              <div className="mt-5 grid gap-3">
                {reasons.map((reason) => (
                  <div
                    key={reason}
                    className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    {isFake ? (
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    )}
                    <span className="text-sm text-slate-300">{reason}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="font-semibold">Recommended Banking Action</h3>

              <div className="mt-5 space-y-3">
                {actions.map((action) => (
                  <div
                    key={action}
                    className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                    <span className="text-sm text-slate-300">{action}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate(isFake ? "evidence" : "home")}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-slate-950 transition ${
                  isFake
                    ? "bg-cyan-400 hover:bg-cyan-300"
                    : "bg-emerald-400 hover:bg-emerald-300"
                }`}
              >
                {isFake ? "View Forensic Evidence" : "Return to Dashboard"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Clock className="h-5 w-5 text-cyan-400" />
            Analysis completed at {new Date(data.timestamp).toLocaleString()}.
          </div>
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
        className={`mt-2 text-2xl font-bold ${
          danger ? "text-red-400" : "text-slate-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}