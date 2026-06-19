import { useEffect, useState } from "react";
import { getAgencyTypes } from "../api/agencyTypes";
import { getHomeStats, getAgencies } from "../api/agencies";
import type { AgencyType, HomeStats } from "../types/agency";
import { HeroSection } from "../components/home/HeroSection";
import { StatsSection } from "../components/home/StatsSection";
import { CategoriesSection } from "../components/home/CategoriesSection";
import { AboutSection } from "../components/home/AboutSection";

export function HomePage() {
  const [categories, setCategories] = useState<AgencyType[]>([]);
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);

        const [fetchedCategories, fetchedStats] = await Promise.all([
          getAgencyTypes(),
          getHomeStats(),
        ]);

        const categoriesWithCounts = await Promise.all(
          fetchedCategories.map(async (category) => {
            try {
              const response = await getAgencies({
                page: 1,
                limit: 1,
                type: category.slug,
              });

              return {
                ...category,
                count: response?.success ? response.total : 0,
              };
            } catch (error) {
              console.error(
                `Не вдалося порахувати категорію ${category.slug}:`,
                error,
              );

              return {
                ...category,
                count: 0,
              };
            }
          }),
        );

        if (!isMounted) return;

        setCategories(categoriesWithCounts);
        setStats(fetchedStats);
      } catch (error) {
        console.error(
          "Помилка завантаження даних на головній сторінці:",
          error,
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main>
      <HeroSection />

      <StatsSection stats={stats} />

      <CategoriesSection categories={categories} isLoading={isLoading} />

      <AboutSection />
    </main>
  );
}