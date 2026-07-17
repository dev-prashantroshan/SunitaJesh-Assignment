import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "../components/common/ContinueButton";
import { FullWidthOption } from "../components/common/FullWidthOption";
import { PageContainer } from "../components/common/PageContainer";
import { ProgressBar } from "../components/common/ProgressBar";
import { QuestionHeader } from "../components/common/QuestionHeader";
import { TopNavigation } from "../components/common/TopNavigation";
import { apiFetch } from "../utils/api";
import styles from "./OnboardingStep5Page.module.css";

interface StepOption {
  id: string;
  label: string;
}

interface StepData {
  stepId: number;
  question: string;
  helperText: string;
  options: StepOption[];
}

export function OnboardingStep5Page() {
  const navigate = useNavigate();
  const [step, setStep] = useState<StepData | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchStep = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/api/steps/5");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Unable to load Step 5");
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

  const handleContinue = async () => {
    if (!selectedOptionId) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await apiFetch("/api/onboarding/answers/5", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedOptionIds: [selectedOptionId],
          details: "",
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Unable to save Step 5");
      }

      navigate("/onboarding/6");
    } catch {
      setError("We couldn't save your answer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer>
      <TopNavigation
        stepLabel="Step 5"
        onBack={() => navigate("/onboarding/4")}
        onSkip={() => navigate("/onboarding/6")}
      />
      <div className={styles.progressWrap}>
        <ProgressBar current={5} total={8} />
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
              <FullWidthOption
                key={option.id}
                label={option.label}
                selected={selectedOptionId === option.id}
                onClick={() =>
                  setSelectedOptionId((current) => (current === option.id ? "" : option.id))
                }
              />
            ))}
          </div>
          <div className={styles.footer}>
            <ContinueButton
              disabled={!selectedOptionId}
              loading={saving}
              onClick={handleContinue}
            />
          </div>
        </>
      ) : null}
    </PageContainer>
  );
}
