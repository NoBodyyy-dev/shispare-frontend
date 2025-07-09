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
    isAuthenticated: boolean;
    token: string;

    isLoadingUser: boolean;
    isLoadingAuthenticated: boolean;
    isLoadingVerify: boolean;
    isLoadingLogout: boolean;

    errorAuthenticated: string;
    errorUser?: string;
    errorVerify: string;
    errorLogout: string;

    successCode: boolean;
    successUser: boolean;
    successAuth: boolean;
    successLogout: boolean;
}

export interface RegisterData {
    type: 'IND' | 'LGL';
    legalType: 'ЮЛ' | 'ИП';
    fullName: string;
    legalId: string;
    email: string;
    password: string;
}
