import { PageContainer } from "../layout/PageContainer";
import { Icon } from "../ui/Icon";
import type { HomeStats } from "../../api/agencies";
import styles from "./StatsSection.module.css";

type StatsSectionProps = {
  stats: HomeStats | null;
};

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className={styles.section}>
      <PageContainer>
        <div className={styles.grid}>
          <article className={styles.card}>
            <Icon name="Institutions" size={36} className={styles.icon} />

            <p className={styles.label}>Кількість установ</p>

            <p className={styles.value}>{stats?.agenciesCount || "—"}</p>

            <p className={styles.description}>Дані станом на травень 2026</p>
          </article>

          <article className={styles.card}>
            <Icon name="Workers" size={36} className={styles.icon} />

            <p className={styles.label}>Держслужбовці</p>

            <p className={styles.value}>{stats?.employeesCount || "—"}</p>

            <p className={styles.description}>Дані станом на травень 2026</p>
          </article>

          <article className={styles.card}>
            <Icon name="Regions" size={36} className={styles.icon} />

            <p className={styles.label}>Регіони</p>

            <p className={styles.value}>{stats?.regionsCount || "—"}</p>

            <p className={styles.description}>Повне покриття території</p>
          </article>
        </div>
      </PageContainer>
    </section>
  );
}
