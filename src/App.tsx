import { useState } from "react";
import { DashboardHome } from "./Home";
import { LiveMonitoring } from "./pages/LiveMonitoring";
import { AnalysisPipeline } from "./pages/AnalysisPipeline";
import { DetectionResults } from "./pages/DetectionResults";
import { ForensicEvidence } from "./pages/ForensicEvidence";
import { BankingDecision } from "./pages/BankingDecision";
import { Layout } from "./components/Layout";
import type { BackendDetectionResponse } from "./services/api";

function App() {
  const [page, setPage] = useState("home");
  const [latestResult, setLatestResult] =
    useState<BackendDetectionResponse | null>(null);

  const renderPage = () => {
    if (page === "monitor") {
      return (
        <LiveMonitoring
          onNavigate={setPage}
          onResult={setLatestResult}
        />
      );
    }

    if (page === "analysis") {
      return <AnalysisPipeline onNavigate={setPage} />;
    }

    if (page === "result") {
      return (
        <DetectionResults
          onNavigate={setPage}
          result={latestResult}
        />
      );
    }

    if (page === "evidence") {
  return (
    <ForensicEvidence
      onNavigate={setPage}
      spectrogramImage={latestResult?.spectrogramImage}
      label={latestResult?.label}
      fakeProbability={latestResult?.fakeProbability}
      realProbability={latestResult?.realProbability}
      artifactTime={latestResult?.artifactTime}
      artifactConfidence={latestResult?.artifactConfidence}
      windowScores={latestResult?.windowScores}
    />
  );
}

    if (page === "decision") {
      return <BankingDecision onNavigate={setPage} />;
    }

    return (
      <DashboardHome
        onNavigate={setPage}
        onAnalysisComplete={setLatestResult}
      />
    );
  };

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
