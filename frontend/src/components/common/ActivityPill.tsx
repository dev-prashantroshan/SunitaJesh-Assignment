import {
  Building2,
  Dumbbell,
  Flower2,
  HeartPulse,
  House,
  LucideIcon,
  PersonStanding,
  Sprout,
  TreePine,
} from "lucide-react";
import styles from "./ActivityPill.module.css";

interface ActivityPillProps {
  id: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

const iconByOptionId: Record<string, LucideIcon> = {
  "strength-training": Dumbbell,
  cardio: HeartPulse,
  yoga: Flower2,
  "low-impact-exercise": PersonStanding,
  outdoor: Sprout,
  indoor: Building2,
  home: House,
  "at-the-gym": Dumbbell,
  "in-the-park": TreePine,
};

export function ActivityPill({ id, label, selected, onClick }: ActivityPillProps) {
  const Icon = iconByOptionId[id] ?? Dumbbell;

  return (
    <button
      className={`${styles.pill} ${selected ? styles.selected : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className={styles.iconWrap}>
        <Icon size={22} strokeWidth={2.2} />
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
