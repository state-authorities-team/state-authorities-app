import { Link } from "react-router-dom";
import { PageContainer } from "../layout/PageContainer";
import { Icon } from "../ui/Icon";
import type { AgencyType } from "../../types/agency";
import styles from "./CategoriesSection.module.css";

type CategoriesSectionProps = {
  categories: AgencyType[];
  isLoading: boolean;
};

const categoryIconsBySlug: Record<string, string> = {
  cabinet: "CabMin",

  ministry: "CabMin",
  "ministry-subordinate": "CabMin",

  "state-service": "Institutions",
  service: "Institutions",

  "state-agency": "StateEnterpr",
  agency: "StateEnterpr",

  "state-inspection": "Institutions",
  inspection: "Institutions",

  commission: "Court",
  bureau: "Institutions",

  covv: "Institutions",
  "other-covv": "Institutions",
  "special-covv": "LawEnfAgencies",

  local: "Regions",
  "local-auth": "Regions",
  "local-authorities": "Regions",

  court: "Court",
  enterprise: "StateEnterpr",
  education: "Education",
};

function getCategoryIcon(category: AgencyType) {
  const slug = category.slug?.toLowerCase() || "";
  const name = category.name?.toLowerCase() || "";

  if (categoryIconsBySlug[slug]) {
    return categoryIconsBySlug[slug];
  }

  if (name.includes("міністер")) return "CabMin";
  if (name.includes("служб")) return "StateEnterpr";
  if (name.includes("агентств")) return "StateEnterpr";
  if (name.includes("інспекц")) return "StateEnterpr";
  if (name.includes("коміс")) return "Court";
  if (name.includes("бюро")) return "Institutions";
  if (name.includes("ц овв") || name.includes("цовв")) return "Institutions";
  if (name.includes("місцев")) return "Regions";
  if (name.includes("суд")) return "Court";

  return "Institutions";
}

export function CategoriesSection({
  categories,
  isLoading,
}: CategoriesSectionProps) {
  return (
    <section className={styles.section}>
      <PageContainer>
        <h2 className={styles.title}>Основні категорії державних органів</h2>

        {isLoading ? (
          <p className={styles.loadingText}>Завантаження категорій...</p>
        ) : categories.length === 0 ? (
          <p className={styles.loadingText}>Категорії не знайдено.</p>
        ) : (
          <div className={styles.grid}>
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/catalog?type=${category.slug}`}
                className={`${styles.card} ${
                  index === 0 ? styles.cardActive : ""
                }`}
              >
                <Icon
                  name={getCategoryIcon(category)}
                  size={36}
                  className={styles.icon}
                />

                <div className={styles.content}>
                  <p className={styles.name}>{category.name}</p>

                  <p className={styles.count}>
                    {category.count ?? 0} установ
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageContainer>
    </section>
  );
}