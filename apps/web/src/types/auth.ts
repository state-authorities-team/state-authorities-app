export type LoginPayload = {
  email: string;
  password: string;
};

export type AdminAuthContextValue = {
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};