export interface BackendDetectionResponse {
  success: boolean;
  fileName: string;
  label: "REAL" | "FAKE";
  risk: "LOW" | "HIGH";
  score: number;
  confidence: number;
  message: string;
  recommendedAction: string;
  detectionMethod: string;
  spectrogramImage?: string | null;
  fakeProbability?: number;
  realProbability?: number;
  timestamp: string;
  artifactTime?: number | null;
  artifactConfidence?: number | null;
  windowScores?: { time: number; fakeScore: number }[];
  spectrogramImage?: string | null;
}

export async function analyzeAudio(
  file: File
): Promise<BackendDetectionResponse> {
  const formData = new FormData();
  formData.append("audio", file);

  const response = await fetch("http://localhost:8080/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Audio analysis failed");
  }

  return response.json();
}
