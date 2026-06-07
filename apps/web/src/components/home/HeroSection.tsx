import { PageContainer } from "../layout/PageContainer";
import { Icon } from "../ui/Icon";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <PageContainer>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Національний каталог державних установ України
          </h1>

          <p className={styles.description}>
            Централізована платформа для аналізу структури влади, відстеження
            відповідальності та дослідження взаємозв'язків між державними
            інституціями
          </p>

          <div className={styles.searchPanel}>
            <input
              type="text"
              className={styles.input}
              placeholder="Пошук установ..."
            />

            <button
              type="button"
              className={styles.searchButton}
              aria-label="Пошук"
            >
              <Icon name="Search" size={32} className={styles.searchIcon} />
            </button>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
