import { useState } from "react";
import styles from "./SportCard.module.css";

interface SportCardProps {
  title: string;
  imageSrc: string;
  practiceCount: number;
  selected: boolean;
  onClick: () => void;
}

export function SportCard({ title, imageSrc, practiceCount, selected, onClick }: SportCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const practicesLabel = `${practiceCount} available ${practiceCount === 1 ? "practice" : "practices"}`;

  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
    >
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        <span className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          {practicesLabel}
        </span>
      </div>
      <div className={styles.imageArea}>
        {!imageFailed ? (
          <img className={styles.image} src={imageSrc} alt="" onError={() => setImageFailed(true)} />
        ) : (
          <div className={styles.imagePlaceholder}>{title.slice(0, 1)}</div>
        )}
      </div>
    </button>
  );
}
