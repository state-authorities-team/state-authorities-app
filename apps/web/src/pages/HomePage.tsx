import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { getAgencyTypes } from "../api/agencyTypes";
import { getHomeStats } from "../api/agencies";
import type { AgencyType } from "../types/agency";
import type { HomeStats } from "../api/agencies";

export function HomePage() {
  const [categories, setCategories] = useState<AgencyType[]>([]);
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedCategories, fetchedStats] = await Promise.all([
          getAgencyTypes(),
          getHomeStats(),
        ]);
        setCategories(fetchedCategories);
        setStats(fetchedStats);
      } catch (error) {
        console.error(
          "Помилка завантаження даних на головній сторінці:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main>
      <section className="hero-section">
        <PageContainer>
          <p className="eyebrow">Україна</p>
          <h1>Національний каталог державних установ України</h1>
          <p className="hero-text">
            Централізована платформа для пошуку державних установ, контактної
            інформації та основних відомостей.
          </p>

          <div className="search-panel">
            <input placeholder="Пошук установ..." />
            <Link to="/catalog">Шукати</Link>
          </div>

          <div className="stats-grid">
            <div className="card">
              <strong>{stats?.agenciesCount || "—"}</strong>
              <span>Державних установ</span>
            </div>
            <div className="card">
              <strong>{stats?.employeesCount || "—"}</strong>
              <span>Працівників</span>
            </div>
            <div className="card">
              <strong>{stats?.regionsCount || "—"}</strong>
              <span>Регіонів</span>
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="section">
        <PageContainer>
          <h2>Основні категорії державних установ</h2>

          <div className="category-grid">
            {isLoading ? (
              <p>Завантаження категорій...</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="card">
                  {category.name}
                  {category.count !== undefined && (
                    <span className="category-count"> ({category.count})</span>
                  )}
                </div>
              ))
            )}
          </div>
        </PageContainer>
      </section>

      <section className="section">
        <PageContainer>
          <div className="card about-card">
            <h2>Про платформу</h2>
            <p>
              Платформа допомагає громадянам швидко знаходити державні установи,
              їхні контакти, керівництво та загальну інформацію.
            </p>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
