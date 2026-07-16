import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className={styles.track} aria-label={`Step ${current} of ${total}`}>
      <div className={styles.fill} style={{ width: `${progress}%` }} />
    </div>
  );
}
