import React, { useEffect, useState } from "react";
import { CheckCircle2, Cpu, Radio } from "lucide-react";
import { motion } from "framer-motion";

interface AnalysisPipelineProps {
  onNavigate: (page: string) => void;
}

const steps = [
  "Noise profile cleaned",
  "MFCC features extracted",
  "Spectrogram generated",
  "Pitch continuity checked",
  "Wav2Vec2 embedding processed",
  "CNN spectrogram classifier running",
  "Synthetic artifact scan completed",
  "Risk score calculated",
];

export const AnalysisPipeline: React.FC<AnalysisPipelineProps> = ({
  onNavigate,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = prev + 1;

        if (next >= steps.length) {
          setTimeout(() => onNavigate("result"), 900);
          return steps.length;
        }

        return next;
      });
    }, 650);

    return () => clearInterval(interval);
  }, [onNavigate]);

  const progress = Math.min((activeStep / steps.length) * 100, 100);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="border-b border-slate-800 pb-5">
          <h1 className="text-xl font-bold">AI Analysis Pipeline</h1>
          <p className="text-sm text-slate-500">
            Converting live call audio into forensic evidence
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
              <Cpu className="h-8 w-8 text-cyan-400" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Voice Intelligence Engine
              </p>
              <h2 className="mt-1 text-3xl font-bold">
                Analyzing synthetic voice artifacts
              </h2>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Pipeline Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                className="h-full bg-cyan-400"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {steps.map((step, index) => {
              const done = index < activeStep;
              const active = index === activeStep;

              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl border p-4 ${
                    done
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : active
                      ? "border-cyan-500/30 bg-cyan-500/10"
                      : "border-slate-800 bg-slate-950"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-200">
                      {step}
                    </p>

                    {done ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : active ? (
                      <Radio className="h-5 w-5 animate-pulse text-cyan-400" />
                    ) : (
                      <span className="h-5 w-5 rounded-full border border-slate-700" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-sm font-semibold text-slate-300">
              Current Finding
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {activeStep < 3
                ? "Building acoustic profile from live banking call..."
                : activeStep < 6
                ? "Comparing pitch transitions and spectrogram texture..."
                : "Synthetic harmonic pattern detected. Preparing risk decision..."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};