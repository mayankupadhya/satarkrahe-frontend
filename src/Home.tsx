import React, { useRef, useState } from "react";
import { Radio, UploadCloud, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { analyzeAudio } from "./services/api";
import type { BackendDetectionResponse } from "./services/api";

interface DashboardHomeProps {
  onNavigate: (page: string) => void;
  onAnalysisComplete: (result: BackendDetectionResponse) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  onNavigate,
  onAnalysisComplete,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const coreBenefits = [
    "Detects cloned voices within the first 10 seconds",
    "Explainable AI forensic evidence",
    "Live risk monitoring during calls",
    "Banking action recommendations",
  ];

  const pipelineStages = [
    { label: "Audio", desc: "Live call input" },
    { label: "AI Analysis", desc: "Voice artifact scan" },
    { label: "Evidence", desc: "Timeline + reasons" },
    { label: "Decision", desc: "Banking action" },
  ];

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError("");

      const result = await analyzeAudio(file);
      onAnalysisComplete(result);
onNavigate("result");
    } catch (error) {
      console.error(error);
      setUploadError("Backend connection failed. Check Spring Boot server.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <input
        ref={fileInputRef}
        type="file"
        accept=".wav,.mp3,.m4a,.webm,.ogg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />

      <div className="mx-auto max-w-7xl space-y-14">
        <header className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-lg font-bold tracking-tight">SatarkRahe.ai</h2>
            <p className="text-xs text-slate-500">
              Audio Forensics for Voice Security
            </p>
          </div>

          <div className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 sm:block">
            Backend Ready
          </div>
        </header>

        <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              LIVE BANKING VOICE SECURITY DEMO
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Protect every banking conversation{" "}
              <span className="text-cyan-400">before fraud happens.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400">
              AI-powered audio forensics that detects cloned voices, highlights
              suspicious artifacts, and recommends banking actions within the
              first 10 seconds of a call.
            </p>

           <div className="mt-8 flex flex-col gap-4 sm:flex-row">
  {/* Button 1 — Live Monitoring */}
  <button
    onClick={() => onNavigate("monitor")}
    className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500 bg-cyan-500/10 px-6 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
  >
    <Radio className="h-4 w-4" />
    Live Monitoring
  </button>

  {/* Button 2 — Upload Audio */}
  <button
    onClick={() => fileInputRef.current?.click()}
    disabled={isUploading}
    className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-slate-200 transition hover:border-cyan-500 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {isUploading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <UploadCloud className="h-4 w-4" />
    )}
    {isUploading ? "Analyzing..." : "Upload Audio"}
  </button>
</div>

            {uploadError && (
              <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {uploadError}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Backend Detection Preview
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Spring Boot API · /api/analyze
                  </p>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  Connected
                </span>
              </div>

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex h-20 items-center gap-1 overflow-hidden">
                  {Array.from({ length: 42 }).map((_, idx) => {
                    const heights = [
                      18, 34, 22, 55, 28, 68, 42, 25, 51, 16, 62, 30, 20, 48,
                      36, 70, 34, 44, 18, 58, 26, 50, 15, 64, 32, 52, 22, 43,
                      18, 56, 30, 24, 47, 66, 32, 18, 40, 26, 54, 20, 36, 25,
                    ];

                    return (
                      <motion.div
                        key={idx}
                        className="w-1 rounded-full bg-cyan-400/70"
                        animate={{
                          height: [
                            `${heights[idx] * 0.55}%`,
                            `${heights[idx]}%`,
                            `${heights[idx] * 0.55}%`,
                          ],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.1 + (idx % 5) * 0.12,
                          ease: "easeInOut",
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Metric label="API Port" value="8080" />
                <Metric label="Upload Field" value="audio" valueClass="text-emerald-400" />
                <Metric label="Status" value="Ready" valueClass="text-cyan-400" />
                <Metric label="Mode" value="Mock ML" />
              </div>
            </div>
          </motion.div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Why SatarkRahe.ai
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-100">
                From voice detection to banking action.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Built for fraud monitoring teams to move from voice detection to
                evidence and action in a single workflow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {coreBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <p className="text-sm text-slate-300">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Demo Flow
          </p>

          <div className="grid gap-4 sm:grid-cols-4">
            {pipelineStages.map((stage, idx) => (
              <div
                key={stage.label}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-5"
              >
                <p className="text-xs text-slate-500">Step {idx + 1}</p>
                <h3 className="mt-2 font-semibold text-slate-100">
                  {stage.label}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{stage.desc}</p>

                {idx < pipelineStages.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-slate-800 bg-slate-950 p-1 sm:block">
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

function Metric({
  label,
  value,
  valueClass = "text-slate-200",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-lg font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}