import { useState, useEffect } from "react";
import { Landing } from "./components/Landing";
import { IntakeWizard, IntakeData } from "./components/IntakeWizard";
import { Loading } from "./components/Loading";
import { Results } from "./components/Results";
import { StepDetail } from "./components/StepDetail";
import { Privacy } from "./components/Privacy";
import { FinancialStep } from "./components/StepCard";

type Screen =
  | "landing"
  | "intake"
  | "loading"
  | "results"
  | "step-detail"
  | "privacy";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [intakeData, setIntakeData] = useState<IntakeData | null>(null);
  const [selectedStep, setSelectedStep] = useState<FinancialStep | null>(null);

  const handleStart = () => {
    setCurrentScreen("intake");
  };

  const handleIntakeComplete = (data: IntakeData) => {
    setIntakeData(data);
    setCurrentScreen("loading");
    // Simulate processing time
    setTimeout(() => {
      setCurrentScreen("results");
    }, 2000);
  };

  const handleRestart = () => {
    setIntakeData(null);
    setSelectedStep(null);
    setCurrentScreen("landing");
  };

  const handleStepDetail = (step: FinancialStep) => {
    setSelectedStep(step);
    setCurrentScreen("step-detail");
  };

  const handlePrivacy = () => {
    setCurrentScreen("privacy");
  };

  const handleBackFromIntake = () => {
    setCurrentScreen("landing");
  };

  const handleCloseStepDetail = () => {
    setCurrentScreen("results");
  };

  const handleClosePrivacy = () => {
    if (intakeData) {
      setCurrentScreen("results");
    } else {
      setCurrentScreen("landing");
    }
  };

  // Smooth scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentScreen]);

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === "landing" && <Landing onStart={handleStart} />}

      {currentScreen === "intake" && (
        <IntakeWizard
          onComplete={handleIntakeComplete}
          onBack={handleBackFromIntake}
        />
      )}

      {currentScreen === "loading" && <Loading />}

      {currentScreen === "results" && intakeData && (
        <Results
          data={intakeData}
          onRestart={handleRestart}
          onStepDetail={handleStepDetail}
          onPrivacy={handlePrivacy}
        />
      )}

      {currentScreen === "step-detail" && selectedStep && (
        <StepDetail step={selectedStep} onClose={handleCloseStepDetail} />
      )}

      {currentScreen === "privacy" && <Privacy onClose={handleClosePrivacy} />}
    </div>
  );
}
