import { PageContainer } from "../layout/PageContainer";
import { Icon } from "../ui/Icon";
import type { AgencyType } from "../../types/agency";
import styles from "./CategoriesSection.module.css";

type CategoriesSectionProps = {
  categories: AgencyType[];
  isLoading: boolean;
};

const categoryIcons: Record<string, string> = {
  cabinet: "CabMin",
  ministry: "Institutions",
  local: "RegAdmin",
  "local-auth": "Regions",
  enterprise: "StateEnterpr",
  court: "Court",
};

export function CategoriesSection({
  categories,
  isLoading,
}: CategoriesSectionProps) {
  return (
    <section className={styles.section}>
      <PageContainer>
        <h2 className={styles.title}>Основні категорії державних установ</h2>

        {isLoading ? (
          <p>Завантаження категорій...</p>
        ) : (
          <div className={styles.grid}>
            {categories.map((category) => (
              <article key={category.id} className={styles.card}>
                <Icon
                  name={categoryIcons[category.slug]}
                  size={36}
                  className={styles.icon}
                />

                <div className={styles.content}>
                  <p className={styles.name}>{category.name}</p>

                  <p className={styles.count}>{category.count} установ</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </PageContainer>
    </section>
  );
}
