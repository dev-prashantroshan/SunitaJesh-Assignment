import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActivityPill } from "../components/common/ActivityPill";
import { ContinueButton } from "../components/common/ContinueButton";
import { PageContainer } from "../components/common/PageContainer";
import { ProgressBar } from "../components/common/ProgressBar";
import { QuestionHeader } from "../components/common/QuestionHeader";
import { TopNavigation } from "../components/common/TopNavigation";
import styles from "./OnboardingStep3Page.module.css";

interface StepOption {
  id: string;
  label: string;
}

interface StepData {
  stepId: number;
  question: string;
  helperText: string;
  minSelections?: number;
  maxSelections?: number;
  options: StepOption[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEVICE_ID = "device-thomas-001";

export function OnboardingStep3Page() {
  const navigate = useNavigate();
  const [step, setStep] = useState<StepData | null>(null);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchStep = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/steps/3`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Unable to load Step 3");
      }

      setStep(result.data.step);
    } catch {
      setError("We couldn't load this question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStep();
  }, []);

  const toggleOption = (optionId: string) => {
    if (!step) {
      return;
    }

    setSelectedOptionIds((current) => {
      if (current.includes(optionId)) {
        return current.filter((id) => id !== optionId);
      }

      const maxSelections = step.maxSelections ?? step.options.length;

      if (current.length >= maxSelections) {
        return current;
      }

      return [...current, optionId];
    });
  };

  const handleContinue = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/onboarding/answers/3`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-device-id": DEVICE_ID,
        },
        body: JSON.stringify({
          selectedOptionIds,
          details: "",
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Unable to save Step 3");
      }

      navigate("/onboarding/4");
    } catch {
      setError("We couldn't save your answer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const minimumSelections = step?.minSelections ?? 1;
  const canContinue = selectedOptionIds.length >= minimumSelections;

  return (
    <PageContainer>
      <TopNavigation
        stepLabel="Step 3"
        onBack={() => navigate("/onboarding/2")}
        onSkip={() => navigate("/onboarding/4")}
      />
      <div className={styles.progressWrap}>
        <ProgressBar current={3} total={8} />
      </div>

      {loading ? <p className={styles.message}>Loading question...</p> : null}

      {!loading && error && !step ? (
        <div className={styles.errorBox}>
          <p>{error}</p>
          <button type="button" onClick={fetchStep}>
            Retry
          </button>
        </div>
      ) : null}

      {!loading && step ? (
        <>
          <QuestionHeader title={step.question} subtitle={step.helperText} />
          {error ? <p className={styles.inlineError}>{error}</p> : null}
          <div className={styles.options}>
            {step.options.map((option) => (
              <ActivityPill
                key={option.id}
                id={option.id}
                label={option.label}
                selected={selectedOptionIds.includes(option.id)}
                onClick={() => toggleOption(option.id)}
              />
            ))}
          </div>
          <div className={styles.footer}>
            <ContinueButton disabled={!canContinue} loading={saving} onClick={handleContinue} />
          </div>
        </>
      ) : null}
    </PageContainer>
  );
}
