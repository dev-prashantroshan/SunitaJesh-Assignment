import { Check } from "lucide-react";
import styles from "./DietCard.module.css";

interface DietCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export function DietCard({ title, description, selected, onClick }: DietCardProps) {
  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </span>
      {selected ? (
        <span className={styles.check}>
          <Check size={17} strokeWidth={3} />
        </span>
      ) : null}
    </button>
  );
}
