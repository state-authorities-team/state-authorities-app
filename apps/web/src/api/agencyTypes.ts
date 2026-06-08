import { apiClient } from "./client";
import type { AgencyType } from "../types/agency";
import type { ApiListResponse } from "../types/api";

const mockAgencyTypes: AgencyType[] = [
  { id: 1, name: "Кабінет міністрів", slug: "cabinet", count: 24 },
  { id: 2, name: "Міністерства", slug: "ministry", count: 167 },
  { id: 3, name: "Територіальні органи", slug: "local", count: 89 },
  { id: 4, name: "Органи місцевої влади", slug: "local-auth", count: 1834 },
  { id: 5, name: "Державні підприємства", slug: "enterprise", count: 3247 },
  { id: 6, name: "Судова система", slug: "court", count: 678 },
];

export const getAgencyTypes = async (): Promise<AgencyType[]> => {
  try {
    const response =
      await apiClient.get<ApiListResponse<AgencyType>>("/agency-types");

    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data.length > 0
        ? response.data.data
        : mockAgencyTypes;
    }
    return mockAgencyTypes;
  } catch (error) {
    console.warn(
      "Backend /agency-types unavailable, using fallback mock data.",
      error,
    );
    return mockAgencyTypes;
  }
};
