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
  type?: AgencyType;
  headName?: string;
  headTitle?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  region?: string;
}
