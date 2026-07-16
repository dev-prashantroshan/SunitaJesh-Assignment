import styles from "./FullWidthOption.module.css";

interface FullWidthOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function FullWidthOption({ label, selected, onClick }: FullWidthOptionProps) {
  return (
    <button
      className={`${styles.option} ${selected ? styles.selected : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
