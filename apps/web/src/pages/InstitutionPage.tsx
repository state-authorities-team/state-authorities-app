import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { Icon } from "../components/ui/Icon";
import {
  getAgencyById,
  getAgencyNews,
  getRelatedAgencies,
  type AgencyNewsItem,
  type RelatedAgencyItem,
} from "../api/agencies";
import type { Agency } from "../types/agency";
import css from "../styles/InstitutionPage.module.css";

type InfoItemProps = {
  icon: string;
  title: string;
  children: ReactNode;
};

function InfoItem({ icon, title, children }: InfoItemProps) {
  return (
    <div className={css.infoItem}>
      <Icon name={icon} size={20} className={css.infoIcon} />

      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

function getAgencyTypeName(institution: Agency) {
  if (
    institution.agencyType &&
    typeof institution.agencyType === "object" &&
    "name" in institution.agencyType
  ) {
    return institution.agencyType.name;
  }

  return "Не вказано";
}

function getExternalUrl(url: string) {
  if (!url) return "";

  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
}

function formatNewsDate(date?: string) {
  if (!date) return "Дата не вказана";

  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function InstitutionPage() {
  const { id } = useParams<{ id: string }>();

  const [institution, setInstitution] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [news, setNews] = useState<AgencyNewsItem[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState<boolean>(false);

  const [relatedAgencies, setRelatedAgencies] = useState<RelatedAgencyItem[]>(
    [],
  );
  const [isRelatedLoading, setIsRelatedLoading] = useState<boolean>(false);

  const loadInstitution = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getAgencyById(Number(id));
      setInstitution(data);
    } catch (err) {
      console.error("Помилка завантаження установи:", err);
      setInstitution(null);
      setError("Не вдалося завантажити дані про установу. Спробуйте пізніше.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    queueMicrotask(() => {
      void loadInstitution();
    });
  }, [id, loadInstitution]);

  useEffect(() => {
    if (!id) return;

    async function loadNews() {
      try {
        setIsNewsLoading(true);

        const data = await getAgencyNews(Number(id));

        setNews(data.slice(0, 3));
      } catch (err) {
        console.error("Помилка завантаження новин установи:", err);
        setNews([]);
      } finally {
        setIsNewsLoading(false);
      }
    }

    void loadNews();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    async function loadRelatedAgencies() {
      try {
        setIsRelatedLoading(true);

        const data = await getRelatedAgencies(Number(id));

        setRelatedAgencies(data.slice(0, 3));
      } catch (err) {
        console.error("Помилка завантаження пов'язаних установ:", err);
        setRelatedAgencies([]);
      } finally {
        setIsRelatedLoading(false);
      }
    }

    void loadRelatedAgencies();
  }, [id]);

  if (isLoading) {
    return (
      <main className={css.page}>
        <PageContainer>
          <LoadingState message="Завантажуємо інформацію про установу..." />
        </PageContainer>
      </main>
    );
  }

  if (error && !institution) {
    return (
      <main className={css.page}>
        <PageContainer>
          <ErrorState message={error} onRetry={loadInstitution} />
        </PageContainer>
      </main>
    );
  }

  if (!institution) {
    return (
      <main className={css.page}>
        <PageContainer>
          <Link className={css.backLink} to="/catalog">
            ← Назад до каталогу
          </Link>

          <EmptyState
            title="Установу не знайдено"
            message="На жаль, установи з таким ідентифікатором не існує."
          />
        </PageContainer>
      </main>
    );
  }

  const agencyTypeName = getAgencyTypeName(institution);
  const website = institution.website || "";
  const websiteHref = getExternalUrl(website);

  return (
    <main className={css.page}>
      <section className={css.hero}>
        <PageContainer>
          <Link className={css.backLink} to="/catalog">
            ← Назад до каталогу
          </Link>

          <div className={css.tagRow}>
            <span className={css.tag}>{agencyTypeName}</span>
          </div>

          <h1 className={css.title}>{institution.name}</h1>

          <p className={css.subtitle}>
            {institution.description ||
              `${agencyTypeName} у системі державних органів України`}
          </p>
        </PageContainer>
      </section>

      <PageContainer>
        <div className={css.content}>
          <section className={css.topGrid}>
            <div className={css.infoPanel}>
              <InfoItem icon="Address" title="Адреса">
                {institution.address || "Не вказано"}
              </InfoItem>

              <InfoItem icon="Date" title="Дата заснування">
                Не вказано
              </InfoItem>

              <InfoItem icon="Phone" title="Телефон">
                {institution.phone || "Не вказано"}
              </InfoItem>

              <InfoItem icon="Website" title="Вебсайт">
                {website ? (
                  <a href={websiteHref} target="_blank" rel="noreferrer">
                    {website.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  "Не вказано"
                )}
              </InfoItem>

              <InfoItem icon="Email" title="Email">
                {institution.email ? (
                  <a href={`mailto:${institution.email}`}>{institution.email}</a>
                ) : (
                  "Не вказано"
                )}
              </InfoItem>

              <InfoItem icon="Workers" title="Співробітники">
                Не вказано
              </InfoItem>
            </div>

            <aside className={css.leadershipCard}>
              <div className={css.leadershipTitle}>
                <Icon name="Worker" size={18} />
                <span>Керівництво</span>
              </div>

              <h2>{institution.headName || "Керівник не вказаний"}</h2>

              <p>{institution.headTitle}</p>

              <div className={css.appointmentDate}>
                <Icon name="Date" size={18} />

                <div>
                  <strong>Дата призначення</strong>
                  <span>Не вказано</span>
                </div>
              </div>
            </aside>
          </section>

          <section className={css.sectionCard}>
            <div className={css.sectionHeader}>
              <div className={css.sectionTitle}>
                <Icon name="News" size={24} />
                <h2>Останні новини</h2>
              </div>

              {websiteHref && (
                <a
                  href={websiteHref}
                  target="_blank"
                  rel="noreferrer"
                  className={css.allNewsButton}
                >
                  <span>Усі новини</span>
                  <Icon name="RightMenu" size={18} />
                </a>
              )}
            </div>

            {isNewsLoading ? (
              <p className={css.newsMessage}>Завантаження новин...</p>
            ) : news.length === 0 ? (
              <p className={css.newsMessage}>
                Новини для цієї установи поки не знайдено.
              </p>
            ) : (
              <div className={css.newsGrid}>
                {news.map((item, index) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`${css.newsCard} ${
                      index === 0 ? css.newsCardActive : ""
                    }`}
                  >
                    <span>{formatNewsDate(item.publishedAt)}</span>
                    <p>{item.title}</p>
                  </a>
                ))}
              </div>
            )}
          </section>

          <section className={css.descriptionCard}>
            <div className={css.sectionTitle}>
              <Icon name="Description" size={24} />
              <h2>Опис діяльності</h2>
            </div>

            <p>
              {institution.description ||
                `${institution.name} є державним органом у системі органів України. Детальний опис діяльності установи поки відсутній.`}
            </p>
          </section>

          <section className={css.sectionCard}>
            <div className={css.sectionTitle}>
              <Icon name="CabMin" size={24} />
              <h2>Пов'язані державні органи</h2>
            </div>

            {isRelatedLoading ? (
              <p className={css.relatedMessage}>
                Завантаження пов'язаних установ...
              </p>
            ) : relatedAgencies.length === 0 ? (
              <p className={css.relatedMessage}>
                Пов'язані державні органи поки не знайдено.
              </p>
            ) : (
              <div className={css.relatedGrid}>
                {relatedAgencies.map((item) => (
                  <Link
                    key={item.id}
                    to={`/institutions/${item.id}`}
                    className={css.relatedItem}
                  >
                    <span>{item.name}</span>
                    <span aria-hidden="true">›</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </PageContainer>
    </main>
  );
}