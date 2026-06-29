import { PageContainer } from "../layout/PageContainer";
import styles from "./AboutSection.module.css";

export function AboutSection() {
  return (
    <section className={styles.section}>
      <PageContainer>
        <div className={styles.card}>
          <h2 className={styles.title}>Про платформу</h2>

          <p className={styles.description}>
            Каталог державних органів — це централізована
            аналітична платформа. Ми об'єднуємо дані про інституції України в
            єдину структуровану екосистему.
          </p>

          <p className={styles.subtitle}>Кого ми агрегуємо:</p>

          <ul className={styles.list}>
            <li>Державні та муніципальні органи</li>
            <li>Судову та правоохоронну системи</li>
            <li>Освітні, наукові та комунальні організації</li>
          </ul>
        </div>
      </PageContainer>
    </section>
  );
}
