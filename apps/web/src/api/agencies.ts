import { apiClient } from "./client";
import type { Agency } from "../types/agency";
import type { ApiListResponse } from "../types/api";

export interface HomeStats {
  agenciesCount: string;
  employeesCount: string;
  regionsCount: string;
}

const mockStats: HomeStats = {
  agenciesCount: "16 423",
  employeesCount: "2.85M",
  regionsCount: "25",
};

// Тимчасовий моковий список установ
const mockAgencies: Agency[] = [];

export const getHomeStats = async (): Promise<HomeStats> => {
  try {
    // змінимо на реальний запит до бекенду, який повертає статистику
    const response =
      await apiClient.get<ApiListResponse<Agency>>("/agencies?limit=1");

    if (response.data?.success && response.data.total > 0) {
      return {
        agenciesCount: response.data.total.toLocaleString("uk-UA"),
        employeesCount: "2.85M", // Поки що фіксоване значення, оскільки немає даних про кількість працівників
        regionsCount: "25", // Поки що фіксоване значення, оскільки немає даних про кількість регіонів
      };
    }
    return mockStats;
  } catch (error) {
    console.warn(
      "Backend /agencies unavailable for stats, using fallback mock stats.",
      error,
    );
    return mockStats;
  }
};

/**
 * Отримати список усіх установ (з підтримкою фільтрації та пагінації)
 */
export const getAgencies = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}): Promise<ApiListResponse<Agency>["data"]> => {
  try {
    const response = await apiClient.get<ApiListResponse<Agency>>("/agencies", {
      params,
    });

    if (response.data?.data && response.data.data.length > 0) {
      return response.data.data;
    }
    return mockAgencies;
  } catch (error) {
    console.warn(
      "Backend /agencies unavailable, using fallback mock agencies.",
      error,
    );
    return mockAgencies;
  }
};
