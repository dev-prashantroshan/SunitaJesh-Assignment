import styles from "./QuestionHeader.module.css";

interface QuestionHeaderProps {
  title: string;
  subtitle: string;
}

export function QuestionHeader({ title, subtitle }: QuestionHeaderProps) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
