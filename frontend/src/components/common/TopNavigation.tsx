import { ArrowLeft } from "lucide-react";
import styles from "./TopNavigation.module.css";

interface TopNavigationProps {
  stepLabel: string;
  onBack?: () => void;
  onSkip?: () => void;
}

export function TopNavigation({ stepLabel, onBack, onSkip }: TopNavigationProps) {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <button className={styles.backButton} type="button" aria-label="Go back" onClick={onBack}>
          <ArrowLeft size={22} strokeWidth={2.4} />
        </button>
        <span className={styles.verticalDivider} aria-hidden="true" />
        <span className={styles.stepLabel}>{stepLabel}</span>
        <button className={styles.skipButton} type="button" onClick={onSkip}>
          Skip question
        </button>
      </div>
    </header>
  );
}
