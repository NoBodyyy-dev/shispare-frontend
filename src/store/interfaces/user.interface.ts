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
    profileUser?: UserInterface;
    isAuthenticated: boolean;
    token: string;
    users: UserInterface[];

    isLoadingUser: boolean;
    isLoadingProfileUser: boolean,
    isLoadingAuthenticated: boolean;
    isLoadingVerify: boolean;
    isLoadingLogout: boolean;
    isLoadingUsers: boolean

    errorAuthenticated: string;
    errorProfileUser: string;
    errorUser?: string;
    errorVerify: string;
    errorLogout: string;
    errorUsers: string

    successCode: boolean;
    successProfileUser: boolean,
    successUser: boolean;
    successAuth: boolean;
    successLogout: boolean;
    successUsers: boolean
}

export interface RegisterData {
    type: 'IND' | 'LGL';
    legalType: 'ЮЛ' | 'ИП';
    fullName: string;
    legalId: string;
    email: string;
    password: string;
}
