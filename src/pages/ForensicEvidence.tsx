import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  BarChart3,

  Activity,
} from "lucide-react";

interface ForensicEvidenceProps {
  onNavigate: (page: string) => void;
  spectrogramImage?: string | null;
  label?: "REAL" | "FAKE" | string;
  fakeProbability?: number;
  realProbability?: number;
  confidence?: number;
  ganFingerprint?: number;
  explainabilityScore?: number;
  artifactTime?: number | null;
  artifactConfidence?: number | null;
  windowScores?: { time: number; fakeScore: number }[];
}

export const ForensicEvidence: React.FC<ForensicEvidenceProps> = ({
  onNavigate,
  spectrogramImage,
  label = "UNKNOWN",
  fakeProbability = 0,
  realProbability = 100,
  confidence = 0,
  ganFingerprint = 95,
  explainabilityScore = 94,
  artifactTime = null,
  artifactConfidence = null,
  windowScores = [],
}) => {
  const [isLoading] = useState(false);
  const isFake = label === "FAKE";
  const finalConfidence = isFake ? fakeProbability : realProbability;

  const artifactPosition =
    windowScores.length > 0 && artifactTime != null
      ? Math.min(
          (artifactTime /
            (windowScores[windowScores.length - 1].time + 1.5)) *
            100,
          85
        )
      : 65;

  const pipelineSteps = [
    { label: "Audio received", time: "00:00.00", done: true },
    { label: "Format conversion", time: "00:01.12", done: true },
    { label: "MFCC extraction", time: "00:02.47", done: true },
    { label: "Feature analysis", time: "00:04.20", done: true },
    {
      label: isFake ? "Artifact detected" : "No artifact found",
      time: "00:06.41",
      done: true,
      alert: isFake,
    },
    { label: "Risk assessment", time: "00:09.18", done: true },
    { label: "Decision generated", time: "00:10.40", done: true },
  ];

  const xaiMetrics = [
    {
      label: "Spectral pattern",
      value: isFake ? 88 : 12,
      status: isFake ? "suspicious" : "normal",
    },
    {
      label: "Voice texture",
      value: isFake ? 91 : 8,
      status: isFake ? "abnormal" : "normal",
    },
    {
      label: "Pitch stability",
      value: isFake ? 84 : 15,
      status: isFake ? "low" : "normal",
    },
    {
      label: "Acoustic artifacts",
      value: isFake ? 95 : 5,
      status: isFake ? "high" : "normal",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate("result")}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to results
            </button>
            <div className="h-4 w-px bg-slate-700" />
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Voice Forensics Report
              </p>
              <p className="text-sm font-medium text-slate-200">
                Case SBI-2026-08421
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              {new Date().toLocaleString()}
            </span>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                isFake
                  ? "bg-red-500/15 text-red-400 border border-red-500/30"
                  : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {isFake ? "Threat detected" : "Voice verified"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Summary row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "Verdict",
              value: isFake ? "Synthetic voice" : "Genuine voice",
              color: isFake ? "text-red-400" : "text-emerald-400",
            },
            {
              label: "Confidence",
              value: `${finalConfidence?.toFixed(1)}%`,
              color: "text-slate-200",
            },
            {
              label: "Risk level",
              value: isFake ? "High" : "Low",
              color: isFake ? "text-red-400" : "text-emerald-400",
            },
            {
              label: "Artifact at",
              value:
                artifactTime != null ? `${artifactTime}s` : "—",
              color: isFake ? "text-amber-400" : "text-slate-400",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4"
            >
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className={`text-lg font-semibold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left column */}
          <div className="col-span-2 space-y-6">
            {/* Waveform */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  <h2 className="text-sm font-medium text-slate-200">
                    Waveform analysis
                  </h2>
                </div>
                {isFake && artifactTime != null && (
                  <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                    Artifact at {artifactTime}s
                  </span>
                )}
              </div>

              {/* Waveform bars */}
              <div className="relative h-24 flex items-center gap-[2px] overflow-hidden rounded-lg bg-slate-950 px-3">
                {Array.from({ length: 80 }, (_, i) => {
                  const h = 20 + Math.sin(i * 0.4) * 15 + Math.random() * 30;
                  const isArtifactZone =
                    isFake && i > 50 && i < 65;
                  return (
                    <motion.div
                      key={i}
                      className={`flex-1 rounded-sm ${
                        isArtifactZone
                          ? "bg-red-400/80"
                          : "bg-cyan-500/50"
                      }`}
                      animate={{ height: [`${h * 0.6}%`, `${h}%`, `${h * 0.6}%`] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2 + (i % 5) * 0.1,
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}
                {isFake && (
                  <div className="absolute top-1 right-3 bg-red-500/20 border border-red-500/40 rounded px-2 py-0.5">
                    <p className="text-[10px] text-red-300 font-medium">
                      Artifact zone
                    </p>
                  </div>
                )}
              </div>

              {/* Confidence bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-500">
                    {isFake ? "Synthetic signal match" : "Genuine voice match"}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      isFake ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {finalConfidence?.toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      isFake
                        ? "bg-gradient-to-r from-amber-500 to-red-500"
                        : "bg-gradient-to-r from-cyan-500 to-emerald-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${finalConfidence}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {isFake
                    ? `Synthetic artifacts detected near ${artifactTime ?? "—"}s. Voice shows unnatural consistency in pitch and spectral smoothness.`
                    : "Natural pitch variation and breathing patterns detected. Consistent with genuine human voice."}
                </p>
              </div>
            </div>

            {/* Spectrogram */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  <h2 className="text-sm font-medium text-slate-200">
                    Mel spectrogram
                  </h2>
                </div>
                {spectrogramImage && !isLoading && (
                  <span className="text-xs text-slate-500 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
                    Generated from audio
                  </span>
                )}
              </div>

              <div className="relative h-52 rounded-lg overflow-hidden bg-slate-950">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-xs text-slate-500">
                      Generating spectrogram...
                    </p>
                  </div>
                ) : spectrogramImage ? (
                  <>
                    <img
                      src={spectrogramImage}
                      alt="Mel spectrogram"
                      className="h-full w-full object-cover opacity-90"
                    />
                    {isFake && (
                      <div
                        className="absolute top-[8%] h-[84%] w-20 rounded border border-dashed border-red-400/70 bg-red-500/10"
                        style={{ left: `${artifactPosition}%` }}
                      >
                        <div className="absolute -top-5 left-0 right-0 text-center">
                          <span className="text-[9px] text-red-300 bg-slate-900/90 px-1.5 py-0.5 rounded">
                            {artifactTime != null
                              ? `${artifactTime}s`
                              : "artifact"}
                          </span>
                        </div>
                        {artifactConfidence != null && (
                          <div className="absolute bottom-1 left-0 right-0 text-center">
                            <span className="text-[9px] text-red-300">
                              {artifactConfidence.toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-xs text-slate-500">
                      No spectrogram available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Verdict card */}
            <div
              className={`rounded-xl border p-5 ${
                isFake
                  ? "bg-red-500/5 border-red-500/20"
                  : "bg-emerald-500/5 border-emerald-500/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {isFake ? (
                  <ShieldAlert className="h-5 w-5 text-red-400" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isFake ? "text-red-300" : "text-emerald-300"
                  }`}
                >
                  {isFake ? "Synthetic voice detected" : "Voice verified"}
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  {
                    label: "Prediction",
                    value: isFake ? "Fake" : "Real",
                    color: isFake ? "text-red-400" : "text-emerald-400",
                  },
                  {
                    label: "Confidence",
                    value: `${finalConfidence?.toFixed(1)}%`,
                    color: "text-slate-200",
                  },
                  {
                    label: "Risk",
                    value: isFake ? "High" : "Low",
                    color: isFake ? "text-red-400" : "text-emerald-400",
                  },
                  {
                    label: "Action",
                    value: isFake
                      ? "Block transaction"
                      : "Allow transaction",
                    color: "text-slate-300",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-slate-500">{row.label}</span>
                    <span className={`text-xs font-medium ${row.color}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="h-4 w-4 text-cyan-400" />
                <h2 className="text-sm font-medium text-slate-200">
                  ML pipeline
                </h2>
              </div>
              <div className="space-y-2.5">
                {pipelineSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                        step.alert
                          ? "bg-red-400"
                          : step.done
                          ? "bg-cyan-400"
                          : "bg-slate-700"
                      }`}
                    />
                    <span className="text-xs text-slate-400 flex-1">
                      {step.label}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono">
                      {step.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* XAI Metrics */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-slate-200">
                  Feature analysis
                </h2>
                <span className="text-xs text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">
                  XAI {explainabilityScore}%
                </span>
              </div>
              <div className="space-y-3">
                {xaiMetrics.map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">{m.label}</span>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          m.status === "normal"
                            ? "text-emerald-400 bg-emerald-400/10"
                            : m.status === "suspicious"
                            ? "text-amber-400 bg-amber-400/10"
                            : "text-red-400 bg-red-400/10"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          m.status === "normal"
                            ? "bg-emerald-500"
                            : m.status === "suspicious"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${m.value}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Model info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-sm font-medium text-slate-200 mb-3">
                Model
              </h2>
              <div className="space-y-2">
                {[
                  { label: "Features", value: "MFCC + Mel spectrogram" },
                  { label: "Classifier", value: "Random Forest v6" },
                  { label: "Backend", value: "FastAPI + scikit-learn" },
                  { label: "Pipeline", value: "React + Spring + FastAPI" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-slate-500">{row.label}</span>
                    <span className="text-xs text-slate-300">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer action */}
        <div
          className={`rounded-xl border p-5 flex items-center justify-between ${
            isFake
              ? "bg-red-500/5 border-red-500/20"
              : "bg-emerald-500/5 border-emerald-500/20"
          }`}
        >
          <div className="flex items-start gap-3">
            {isFake ? (
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p
                className={`text-sm font-medium mb-1 ${
                  isFake ? "text-red-300" : "text-emerald-300"
                }`}
              >
                {isFake ? "Recommended action" : "Verification passed"}
              </p>
              <div className="flex gap-4">
                {isFake ? (
                  <>
                    <span className="text-xs text-slate-400">
                      • Block transaction
                    </span>
                    <span className="text-xs text-slate-400">
                      • Trigger secondary verification
                    </span>
                    <span className="text-xs text-slate-400">
                      • Alert fraud team
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-slate-400">
                      • Continue standard workflow
                    </span>
                    <span className="text-xs text-slate-400">
                      • Log verification result
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate("decision")}
            className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
              isFake
                ? "bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
            }`}
          >
            Banking decision →
          </button>
        </div>
      </div>
    </div>
  );
};
