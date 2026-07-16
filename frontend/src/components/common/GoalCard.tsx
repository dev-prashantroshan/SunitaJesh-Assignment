import { Check } from "lucide-react";
import styles from "./GoalCard.module.css";

interface GoalCardProps {
  title: string;
  description: string;
  imageUrl: string;
  selected: boolean;
  onClick: () => void;
}

export function GoalCard({ title, description, imageUrl, selected, onClick }: GoalCardProps) {
  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className={styles.checkBox}>
        {selected ? <Check size={16} strokeWidth={3} /> : null}
      </span>
      <span className={styles.decorLarge} />
      <span className={styles.decorSmallTop} />
      <span className={styles.decorSmallLeft} />
      <span className={styles.decorSmallRight} />
      <span className={styles.imageWrap}>
        <img className={styles.image} src={imageUrl} alt="" />
      </span>
      <span className={styles.title}>{title}</span>
      <span className={styles.description}>{description}</span>
    </button>
  );
}
