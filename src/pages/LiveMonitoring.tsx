import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Mic,
  Radio,
  ShieldAlert,
  Square,
} from "lucide-react";
import { motion } from "framer-motion";
import { analyzeAudio } from "../services/api";
import type { BackendDetectionResponse } from "../services/api";

interface LiveMonitoringProps {
  onNavigate: (page: string) => void;
  onResult: (result: BackendDetectionResponse) => void;
}

export const LiveMonitoring: React.FC<LiveMonitoringProps> = ({
  onNavigate,
  onResult,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [risk, setRisk] = useState(8);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [latestResult, setLatestResult] =
    useState<BackendDetectionResponse | null>(null);
  const [logs, setLogs] = useState<string[]>(["Ready for mic monitoring"]);
  const [error, setError] = useState("");

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isMonitoringRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const chunkCountRef = useRef(0);
  const chunkResultsRef = useRef<BackendDetectionResponse[]>([]);

  const isHighRisk = latestResult?.label === "FAKE" || risk >= 80;

useEffect(() => {
    if (!isMonitoring) return;

    const timer = window.setInterval(() => {
      setSeconds((prev) => {
        if (prev >= 10) {
          window.clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isMonitoring]);

useEffect(() => {
    if (!isMonitoring) return;

    const timer = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const addLog = (message: string) => {
    setLogs((prev) => [message, ...prev].slice(0, 8));
  };

 const analyzeChunk = async (blob: Blob) => {
    const file = new File([blob], `live_chunk_${Date.now()}.webm`, {
      type: "audio/webm",
    });

    addLog(`Analyzing chunk ${chunkCountRef.current + 1}/2`);

    const result = await analyzeAudio(file);

    chunkResultsRef.current.push(result);

    setLatestResult(result);
    setRisk(result.score);

    addLog(
      result.label === "FAKE"
        ? `High risk detected: ${result.score}%`
        : `Voice appears genuine: ${result.confidence}%`
    );

    // Only send the combined/averaged result once BOTH chunks are in.
    // This avoids a single noisy 5-second window flipping the final verdict.
    if (chunkResultsRef.current.length >= 2) {
      const results = chunkResultsRef.current;

const avgFakeProbability =
  results.reduce((sum, r) => sum + (r.score ?? 0), 0) /
  results.length;
      const avgScore =
        results.reduce((sum, r) => sum + (r.score ?? 0), 0) / results.length;
      const avgConfidence =
        results.reduce((sum, r) => sum + (r.confidence ?? 0), 0) /
        results.length;

      // Final label decided by the averaged fake-probability, not just
      // whichever chunk happened to run last.
      const finalLabel = avgFakeProbability >= 23 ? "FAKE" : "REAL";
const combinedResult: BackendDetectionResponse = {
  ...results[results.length - 1],
  label: finalLabel,
  score: Math.round(avgScore),
  confidence: Math.round(avgConfidence * 100) / 100,
};

      addLog(
        `Combined result from both chunks: ${finalLabel} (${combinedResult.score}% fake)`
      );

      onResult(combinedResult);
    }

    return result;
  };

  const finishTenSecondAnalysis = () => {
    addLog("10-second analysis complete");
    isMonitoringRef.current = false;
    setIsMonitoring(false);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());

    recorderRef.current = null;
    streamRef.current = null;
    chunksRef.current = [];

    window.setTimeout(() => {
      onNavigate("result");
    }, 900);
  };

 const recordOneChunkBlob = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!streamRef.current || !isMonitoringRef.current) {
        reject(new Error("Stream not available"));
        return;
      }

      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(streamRef.current, { mimeType });
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        resolve(blob);
      };

      recorder.start();
      addLog(`Recording chunk ${chunkCountRef.current + 1}/2`);

      timerRef.current = window.setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }, 5000);
    });
  };

  const recordOneChunk = async () => {
    if (!isMonitoringRef.current) return;

    try {
      // Step 1: record both 5-second chunks back-to-back, no waiting for analysis in between
      const blob1 = await recordOneChunkBlob();
      chunkCountRef.current += 1;

      if (!isMonitoringRef.current) return;

      const blob2 = await recordOneChunkBlob();
      chunkCountRef.current += 1;

      if (!isMonitoringRef.current) return;

      // Step 2: now analyze both chunks in parallel - this happens AFTER
      // the 10 seconds of recording is already done, so it doesn't add to
      // the on-screen call timer.
      addLog("Recording complete, analyzing both chunks...");

      if (blob1.size > 0) await analyzeChunk(blob1);
      if (blob2.size > 0) await analyzeChunk(blob2);
    } catch (err) {
      console.error(err);
      setError("Mic chunk analysis failed. Check backend + ML service.");
      addLog("Backend analysis failed");
    }

    if (!isMonitoringRef.current) return;
    finishTenSecondAnalysis();
  };

  const startMicMonitoring = async () => {
    try {
      setError("");
      setSeconds(0);
      setRisk(8);
      setLatestResult(null);
      setLogs(["Mic permission requested"]);
      chunkCountRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      isMonitoringRef.current = true;
      setIsMonitoring(true);

      addLog("Mic monitoring started");
      recordOneChunk();
    } catch (err) {
      console.error(err);
      setError("Microphone permission denied or unavailable.");
      addLog("Mic permission failed");
    }
  };

  const stopMicMonitoring = () => {
    isMonitoringRef.current = false;
    setIsMonitoring(false);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());

    recorderRef.current = null;
    streamRef.current = null;
    chunksRef.current = [];

    addLog("Mic monitoring stopped");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl font-bold">Live Mic Monitoring</h1>
            <p className="text-sm text-slate-500">
              Two 5-second chunks analyzed within first 10 seconds
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
              Call Time 00:{String(seconds).padStart(2, "0")}
            </div>

            {!isMonitoring ? (
              <button
                onClick={startMicMonitoring}
                className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-300"
              >
                <Mic className="h-4 w-4" />
                Start Mic
              </button>
            ) : (
              <button
                onClick={stopMicMonitoring}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-400"
              >
                <Square className="h-4 w-4" />
                Stop
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="grid items-start gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-slate-500">
                  Current Call
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  Incoming Banking Voice Stream
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Customer: Anil Sharma · Account: XXXX4582 · Transaction:
                  ₹2,50,000
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  isHighRisk
                    ? "bg-red-500/10 text-red-400"
                    : isMonitoring
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {isHighRisk ? "High Risk" : isMonitoring ? "Monitoring" : "Idle"}
              </span>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex h-44 items-center gap-1 overflow-hidden">
                {Array.from({ length: 90 }).map((_, idx) => {
                  const h = ((idx * 17) % 70) + 12;
                  const active = isMonitoring && idx < (seconds % 10) * 9;

                  return (
                    <motion.div
                      key={idx}
                      className={`w-1 rounded-full ${
                        isHighRisk && idx > 65
                          ? "bg-red-400"
                          : active
                          ? "bg-cyan-400"
                          : "bg-slate-700"
                      }`}
                      animate={{
                        height: [`${h * 0.6}%`, `${h}%`, `${h * 0.6}%`],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1 + (idx % 5) * 0.1,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-300">
                  Live Risk Score
                </p>
                <p
                  className={`text-3xl font-bold ${
                    isHighRisk ? "text-red-400" : "text-cyan-400"
                  }`}
                >
                  {risk}%
                </p>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className={`h-full ${
                    isHighRisk ? "bg-red-500" : "bg-cyan-400"
                  }`}
                  animate={{ width: `${risk}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Critical</span>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-300">
                      10-second Detection Window
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Two 5-second mic chunks are analyzed automatically
                    </p>
                  </div>

                  <p
                    className={`text-lg font-bold ${
                      isHighRisk ? "text-red-400" : "text-cyan-400"
                    }`}
                  >
                    {Math.min(seconds, 10)} / 10 sec
                  </p>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    className={
                      isHighRisk ? "h-full bg-red-500" : "h-full bg-cyan-400"
                    }
                    animate={{ width: `${Math.min((seconds / 10) * 100, 100)}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="font-semibold">Detection Status</h3>
              <div className="mt-5 space-y-4">
                <StatusRow label="Mic Stream" done={isMonitoring} />
                <StatusRow label="First 5-sec Chunk" done={chunkCountRef.current >= 1} />
                <StatusRow label="Second 5-sec Chunk" done={chunkCountRef.current >= 2} />
                <StatusRow label="ML Decision" done={!!latestResult} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="font-semibold">Latest ML Result</h3>
              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Label
                </p>
                <p
                  className={`mt-2 text-2xl font-bold ${
                    latestResult?.label === "FAKE"
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {latestResult?.label ?? "Waiting..."}
                </p>

                <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
                  Method
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {latestResult?.detectionMethod ??
                    "MFCC Acoustic Random Forest"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="font-semibold">Live Event Logs</h3>
              <div className="mt-5 space-y-3">
                {logs.map((log, idx) => (
                  <motion.div
                    key={`${log}-${idx}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3"
                  >
                    {log.toLowerCase().includes("risk") ||
                    log.toLowerCase().includes("failed") ? (
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                    )}
                    <p className="text-sm text-slate-300">{log}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {isHighRisk && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6"
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-6 w-6 text-red-400" />
                  <div>
                    <h3 className="font-bold text-red-300">
                      High Risk Alert
                    </h3>
                    <p className="mt-1 text-sm text-red-200/80">
                      Synthetic voice risk detected within first 10 seconds.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
};

function StatusRow({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-400">{label}</span>
      {done ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
      ) : (
        <Radio className="h-5 w-5 animate-pulse text-cyan-400" />
      )}
    </div>
  );
}
