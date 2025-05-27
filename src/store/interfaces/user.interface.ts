export type UserInterface = Partial<{
  _id: string;
  fullName: string;
  legalName?: string;
  email: string;
  role: "User" | "Admin" | "Creator";
  banned: boolean;
  legalType?: string;
  legalId?: number;
  personalKey: string;
}>;

export interface UserState {
  curUser?: UserInterface;
  token: string;
  isLoading: boolean;
}
