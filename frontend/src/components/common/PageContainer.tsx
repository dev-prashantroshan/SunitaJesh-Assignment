import { PropsWithChildren } from "react";
import styles from "./PageContainer.module.css";

export function PageContainer({ children }: PropsWithChildren) {
  return <section className={styles.container}>{children}</section>;
}
