import { PageContainer } from "../layout/PageContainer";
import { Icon } from "../ui/Icon";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <PageContainer>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Каталог державних органів України
          </h1>

          <p className={styles.description}>
            Централізована платформа для аналізу структури влади, відстеження
            відповідальності та дослідження активності державних інституцій
          </p>

          <div className={styles.searchPanel}>
            <input
              type="text"
              className={styles.input}
              placeholder="Пошук за назвою..."
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
