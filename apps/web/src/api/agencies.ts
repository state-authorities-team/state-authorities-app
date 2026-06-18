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

const mockAgenciesFallback: Agency[] = [
  {
    id: 1,
    name: "Державна митна служба України",
    description:
      "Центральний орган виконавчої влади, який реалізує державну митну політику у сфері митної справи.",
    region: "Київ",
    website: "https://customs.gov.ua",
    email: "customs@gov.ua",
    typeId: 1,
    agencyType: { id: 1, name: "Державна служба", slug: "state-service" },
    headName: "Звягінцев Сергій Володимирович",
    headTitle: "Голова служби",
    phone: "+38 (044) 281-28-28",
    address: "вул. Дегтярівська, 11-г, м. Київ, 04119",
  },
  {
    id: 2,
    name: "Міністерство цифрової трансформації України",
    description:
      "Формування та реалізація державної політики у сфері цифровізації, відкритих даних та електронного урядування.",
    region: "Київська обл.",
    website: "https://thedigital.gov.ua",
    email: "info@mintsyfra.gov.ua",
    typeId: 2,
    agencyType: { id: 2, name: "Міністерство", slug: "ministry" },
    headName: "Федоров Михайло Альбертович",
    headTitle: "Міністр",
    phone: "+38 (044) 567-89-01",
    address: "вул. Ділова, 24, м. Київ, 03150",
  },
];

const createMockResponse = (data: Agency[]): ApiListResponse<Agency> => ({
  success: true,
  count: data.length,
  total: data.length,
  totalPages: 1,
  currentPage: 1,
  data,
});

export const getHomeStats = async (): Promise<HomeStats> => {
  try {
    const response =
      await apiClient.get<ApiListResponse<Agency>>("/agencies?limit=1");
    if (response.data?.success && response.data.total > 0) {
      return {
        agenciesCount: response.data.total.toLocaleString("uk-UA"),
        employeesCount: "2.85M",
        regionsCount: "25",
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

export const getAgencies = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}): Promise<ApiListResponse<Agency>> => {
  try {
    const response = await apiClient.get<ApiListResponse<Agency>>("/agencies", {
      params,
    });
    if (response.data?.success && Array.isArray(response.data.data)) {
      if (response.data.data.length === 0 && !params?.type && !params?.search) {
        return createMockResponse(mockAgenciesFallback);
      }
      return response.data;
    }
    return createMockResponse(mockAgenciesFallback);
  } catch (error) {
    console.warn(
      "Backend /agencies unavailable, using fallback mock data.",
      error,
    );
    return createMockResponse(mockAgenciesFallback);
  }
};

export const getAgencyById = async (id: number): Promise<Agency | null> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: Agency }>(
      `/agencies/${id}`,
    );
    if (response.data?.success && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.warn(
      `Backend /agencies/${id} unavailable, using fallback search.`,
      error,
    );
    return mockAgenciesFallback.find((item) => item.id === id) || null;
  }
};

export type AgencyNewsItem = {
  title: string;
  url: string;
  publishedAt?: string;
};

export async function getAgencyNews(id: number): Promise<AgencyNewsItem[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: AgencyNewsItem[];
  }>(`/agencies/${id}/news`);

  return response.data.data;
}

export type RelatedAgencyItem = {
  id: number;
  name: string;
  type?: string;
};

export async function getRelatedAgencies(
  id: number,
): Promise<RelatedAgencyItem[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: RelatedAgencyItem[];
  }>(`/agencies/${id}/related`);

  return response.data.data;
}