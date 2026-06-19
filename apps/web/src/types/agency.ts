export interface AgencyType {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface Agency {
  id: number;
  name: string;
  shortName?: string;
  typeId: number;
  agencyType?: AgencyType;
  headName?: string;
  headTitle?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  region?: string;
}

export type HomeStats = {
  agenciesCount: string;
  employeesCount: string;
  regionsCount: string;
};

export type GetAgenciesParams = {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
};

export type AgencyNewsItem = {
  id: number;
  title: string;
  description?: string | null;
  content?: string | null;
  url: string;
  publishedAt?: string;
  createdAt?: string;
  agencyId?: number;
};

export type AgencyNewsResponse = {
  success: boolean;
  count?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
  data: AgencyNewsItem[];
};

export type AgencyPayload = {
  name: string;
  shortName?: string | null;
  typeId?: number;
  headName?: string | null;
  headTitle?: string | null;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  region?: string | null;
};