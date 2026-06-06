import { PageContainer } from "../layout/PageContainer";
import styles from "./AboutSection.module.css";

export function AboutSection() {
  return (
    <section className={styles.section}>
      <PageContainer>
        <div className={styles.card}>
          <h2 className={styles.title}>Про платформу</h2>

          <p className={styles.description}>
            Національний каталог державних установ — це централізована
            аналітична платформа, яка агрегує інформацію про всі українські
            державні, муніципальні, судові, правоохоронні, освітні, наукові та
            комунальні організації в структуровану екосистему.
          </p>
        </div>
      </PageContainer>
    </section>
  );
}
