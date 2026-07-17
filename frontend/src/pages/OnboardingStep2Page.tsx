import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "../components/common/ContinueButton";
import { PageContainer } from "../components/common/PageContainer";
import { ProgressBar } from "../components/common/ProgressBar";
import { QuestionHeader } from "../components/common/QuestionHeader";
import { SportCard } from "../components/common/SportCard";
import { TopNavigation } from "../components/common/TopNavigation";
import { apiFetch } from "../utils/api";
import styles from "./OnboardingStep2Page.module.css";

interface StepOption {
  id: string;
  label: string;
  image?: string;
  metadata?: {
    availablePractices?: string[];
  };
}

interface StepData {
  stepId: number;
  question: string;
  helperText: string;
  maxSelections?: number;
  options: StepOption[];
}

export function OnboardingStep2Page() {
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
      const response = await apiFetch("/api/steps/2");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Unable to load Step 2");
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
      const response = await apiFetch("/api/onboarding/answers/2", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedOptionIds,
          details: "",
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Unable to save Step 2");
      }

      navigate("/onboarding/3");
    } catch {
      setError("We couldn't save your answer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    }
  };

  return (
    <PageContainer>
      <TopNavigation
        stepLabel="Step 2"
        onBack={handleBack}
        onSkip={() => navigate("/onboarding/3")}
      />
      <div className={styles.progressWrap}>
        <ProgressBar current={2} total={8} />
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
          <div className={styles.grid}>
            {step.options.map((option) => (
              <SportCard
                key={option.id}
                title={option.label}
                imageSrc={option.image || `/assets/sports/${option.id}.png`}
                practiceCount={option.metadata?.availablePractices?.length ?? 0}
                selected={selectedOptionIds.includes(option.id)}
                onClick={() => toggleOption(option.id)}
              />
            ))}
          </div>
          <div className={styles.footer}>
            <ContinueButton
              disabled={selectedOptionIds.length === 0}
              loading={saving}
              onClick={handleContinue}
            />
          </div>
        </>
      ) : null}
    </PageContainer>
  );
}
