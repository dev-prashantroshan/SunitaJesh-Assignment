import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "../components/common/ContinueButton";
import { FullWidthOption } from "../components/common/FullWidthOption";
import { PageContainer } from "../components/common/PageContainer";
import { ProgressBar } from "../components/common/ProgressBar";
import { QuestionHeader } from "../components/common/QuestionHeader";
import { TopNavigation } from "../components/common/TopNavigation";
import { apiFetch } from "../utils/api";
import styles from "./OnboardingStep6Page.module.css";

interface StepOption {
  id: string;
  label: string;
}

interface StepData {
  stepId: number;
  question: string;
  helperText: string;
  detailsMaxLength?: number;
  options: StepOption[];
}

const HEALTH_YES_ID = "health-yes";

export function OnboardingStep6Page() {
  const navigate = useNavigate();
  const [step, setStep] = useState<StepData | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchStep = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/api/steps/6");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Unable to load Step 6");
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

  const handleSelect = (optionId: string) => {
    setSelectedOptionId((current) => {
      const nextOptionId = current === optionId ? "" : optionId;

      if (nextOptionId !== HEALTH_YES_ID) {
        setDetails("");
      }

      return nextOptionId;
    });
  };

  const handleDetailsChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const maxLength = step?.detailsMaxLength ?? 250;
    setDetails(event.target.value.slice(0, maxLength));
  };

  const handleContinue = async () => {
    if (!selectedOptionId || (selectedOptionId === HEALTH_YES_ID && details.trim().length === 0)) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await apiFetch("/api/onboarding/answers/6", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedOptionIds: [selectedOptionId],
          details: selectedOptionId === HEALTH_YES_ID ? details : "",
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Unable to save Step 6");
      }

      navigate("/onboarding/7");
    } catch {
      setError("We couldn't save your answer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const detailsMaxLength = step?.detailsMaxLength ?? 250;
  const showDetails = selectedOptionId === HEALTH_YES_ID;
  const hasRequiredDetails = !showDetails || details.trim().length > 0;
  const canContinue = Boolean(selectedOptionId) && hasRequiredDetails;

  return (
    <PageContainer>
      <TopNavigation
        stepLabel="Step 6"
        onBack={() => navigate("/onboarding/5")}
        onSkip={() => navigate("/onboarding/7")}
      />
      <div className={styles.progressWrap}>
        <ProgressBar current={6} total={8} />
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
          <div className={styles.content}>
            <div className={styles.options}>
              {step.options.map((option) => (
                <FullWidthOption
                  key={option.id}
                  label={option.label}
                  selected={selectedOptionId === option.id}
                  onClick={() => handleSelect(option.id)}
                />
              ))}
            </div>

            {showDetails ? (
              <div className={styles.detailsSection}>
                <div className={styles.divider} />
                <label className={styles.detailsLabel} htmlFor="health-details">
                  Tell us more about your condition
                  <span className={styles.requiredIndicator} aria-hidden="true">
                    *
                  </span>
                </label>
                <div className={styles.textareaWrap}>
                  <textarea
                    id="health-details"
                    className={styles.textarea}
                    maxLength={detailsMaxLength}
                    placeholder="Suggested"
                    required
                    aria-required="true"
                    value={details}
                    onChange={handleDetailsChange}
                  />
                  <span className={styles.counter}>
                    {details.length}/{detailsMaxLength}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
          <div className={styles.footer}>
            <ContinueButton
              disabled={!canContinue}
              loading={saving}
              onClick={handleContinue}
            />
          </div>
        </>
      ) : null}
    </PageContainer>
  );
}
