import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { getAgencyById } from "../api/agencies";
import type { Agency } from "../types/agency";

export function InstitutionPage() {
  const { id } = useParams<{ id: string }>();

  const [institution, setInstitution] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadInstitution = useCallback(async () => {
    if (!id) return;

    setError(null);
    try {
      const data = await getAgencyById(Number(id));
      setInstitution(data);
    } catch (err) {
      console.error("Помилка завантаження установи:", err);
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

  if (isLoading) {
    return (
      <main className="section">
        <PageContainer>
          <LoadingState message="Завантажуємо інформацію про установу..." />
        </PageContainer>
      </main>
    );
  }

  if (error && !institution) {
    return (
      <main className="section">
        <PageContainer>
          <ErrorState message={error} onRetry={loadInstitution} />
        </PageContainer>
      </main>
    );
  }

  if (!institution) {
    return (
      <main className="section">
        <PageContainer>
          <Link className="back-link" to="/catalog">
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

  return (
    <main className="section">
      <PageContainer>
        <Link className="back-link" to="/catalog">
          ← Назад
        </Link>

        <div className="institution-title">
          <p className="eyebrow">Картка установи</p>
          <h1>{institution.name}</h1>
          <p>{institution.description || ""}</p>
        </div>

        <div className="institution-layout">
          <section className="institution-main">
            <div className="card">
              <h2>Основна інформація</h2>

              <dl className="info-list">
                <div>
                  <dt>Тип</dt>
                  <dd>
                    {typeof institution.agencyType === "object"
                      ? institution.agencyType.name
                      : institution.agencyType || "-"}
                  </dd>
                </div>
                <div>
                  <dt>Регіон</dt>
                  <dd>{institution.region || "-"}</dd>
                </div>
                <div>
                  <dt>Адреса</dt>
                  <dd>{institution.address || "Не вказано"}</dd>
                </div>
                <div>
                  <dt>Телефон</dt>
                  <dd>{institution.phone || "-"}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{institution.email || "-"}</dd>
                </div>
                <div>
                  <dt>Сайт</dt>
                  <dd>
                    {institution.website ? (
                      <a
                        href={institution.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {institution.website}
                      </a>
                    ) : (
                      "-"
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="card">
              <h2>Про установу</h2>
              <p>
                {institution.description ||
                  "Короткий опис установи поки відсутній."}
              </p>
            </div>
          </section>

          <aside className="institution-sidebar">
            <div className="card">
              <h2>Керівництво</h2>
              <div className="avatar-placeholder">Фото</div>
              <h3>{institution.headName || "Керівник не вказаний"}</h3>
              <p>{institution.headTitle || ""}</p>
            </div>

            <div className="card">
              <h2>Пов’язані установи</h2>
              <ul>
                <li>Міністерство цифрової трансформації</li>
                <li>Міністерство фінансів України</li>
                <li>Міністерство юстиції України</li>
              </ul>
            </div>
          </aside>
        </div>
      </PageContainer>
    </main>
  );
}
