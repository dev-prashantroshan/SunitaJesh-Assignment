import styles from "./ContinueButton.module.css";

interface ContinueButtonProps {
  disabled: boolean;
  loading?: boolean;
  onClick: () => void;
}

export function ContinueButton({ disabled, loading = false, onClick }: ContinueButtonProps) {
  return (
    <button className={styles.button} type="button" disabled={disabled || loading} onClick={onClick}>
      {loading ? "Saving..." : "Continue"}
    </button>
  );
}
