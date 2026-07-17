import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContinueButton } from "../components/common/ContinueButton";
import { GoalCard } from "../components/common/GoalCard";
import { PageContainer } from "../components/common/PageContainer";
import { ProgressBar } from "../components/common/ProgressBar";
import { QuestionHeader } from "../components/common/QuestionHeader";
import { TopNavigation } from "../components/common/TopNavigation";
import { apiFetch } from "../utils/api";
import styles from "./OnboardingStep8Page.module.css";

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

const imageByOptionId: Record<string, string> = {
  "reduce-stress": "/assets/journeys/reduce-stress.png",
  "improve-sleep": "/assets/journeys/improve-sleep.png",
  "build-strength": "/assets/journeys/build-strength.png",
  "lose-weight": "/assets/journeys/lose-weight.png",
};

const descriptionByOptionId: Record<string, string> = {
  "reduce-stress":
    "Sports help you manage stress. Exercise causes your body to release endorphins, the chemicals that relieve pain and stress.",
  "improve-sleep": "Build calmer evening habits and support deeper, more consistent rest.",
  "build-strength": "Develop stronger muscles, improve posture, and feel more capable in daily movement.",
  "lose-weight": "Create an active routine that supports healthy weight management and steady progress.",
};

export function OnboardingStep8Page() {
  const navigate = useNavigate();
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [step, setStep] = useState<StepData | null>(null);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [lastInteractedOptionId, setLastInteractedOptionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchStep = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/api/steps/8");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Unable to load Step 8");
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

  useEffect(() => {
    if (!lastInteractedOptionId) {
      return;
    }

    cardRefs.current[lastInteractedOptionId]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [lastInteractedOptionId]);

  const minimumSelections = step?.minSelections ?? 1;
  const maximumSelections = step?.maxSelections ?? step?.options.length ?? 4;
  const canContinue =
    selectedOptionIds.length >= minimumSelections && selectedOptionIds.length <= maximumSelections;

  const handleSelect = (optionId: string) => {
    setLastInteractedOptionId(optionId);
    setSelectedOptionIds((current) => {
      if (current.includes(optionId)) {
        return current.filter((selectedId) => selectedId !== optionId);
      }

      if (current.length >= maximumSelections) {
        return current;
      }

      return [...current, optionId];
    });
  };

  const handleContinue = async () => {
    if (!canContinue) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await apiFetch("/api/onboarding/answers/8", {
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
        throw new Error("Unable to save Step 8");
      }

      navigate("/journey");
    } catch {
      setError("We couldn't save your answer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer>
      <TopNavigation
        stepLabel="Step 8"
        onBack={() => navigate("/onboarding/7")}
        onSkip={() => navigate("/journey")}
      />
      <div className={styles.progressWrap}>
        <ProgressBar current={8} total={8} />
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
          <div className={styles.carousel}>
            {step.options.map((option) => (
              <div
                key={option.id}
                ref={(element) => {
                  cardRefs.current[option.id] = element;
                }}
                className={styles.cardItem}
              >
                <GoalCard
                  title={option.label}
                  description={descriptionByOptionId[option.id] ?? ""}
                  imageUrl={imageByOptionId[option.id]}
                  selected={selectedOptionIds.includes(option.id)}
                  onClick={() => handleSelect(option.id)}
                />
              </div>
            ))}
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
