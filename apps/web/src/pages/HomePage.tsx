import { useEffect, useState } from "react";
import { getAgencyTypes } from "../api/agencyTypes";
import { getHomeStats } from "../api/agencies";
import type { AgencyType } from "../types/agency";
import type { HomeStats } from "../api/agencies";
import { HeroSection } from "../components/home/HeroSection";
import { StatsSection } from "../components/home/StatsSection";
import { CategoriesSection } from "../components/home/CategoriesSection";
import { AboutSection } from "../components/home/AboutSection";

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
      <HeroSection />

      <StatsSection stats={stats} />

      <CategoriesSection categories={categories} isLoading={isLoading} />

      <AboutSection />
    </main>
  );
}
