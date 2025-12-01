export type UserInterface = Partial<{
    _id: string;
    fullName: string;
    legalName?: string;
    email: string;
    password: string;
    role: "User" | "Admin" | "Creator";
    banned: boolean;
    legalType?: string;
    legalId?: number;
    telegramId?: number;
    personalKey: string;
    online: boolean;
}>;

export interface UserState {
    curUser?: UserInterface;
    profileUser?: UserInterface;
    isAuthenticated: boolean;
    token: string;
    users: UserInterface[];
    staff: UserInterface[];

    isLoadingUser: boolean;
    isLoadingProfileUser: boolean,
    isLoadingAuthenticated: boolean;
    isLoadingVerify: boolean;
    isLoadingLogout: boolean;
    isLoadingUsers: boolean;
    isLoadingStaff: boolean;

    errorAuthenticated: string;
    errorProfileUser: string;
    errorUser?: string;
    errorVerify: string;
    errorLogout: string;
    errorUsers: string;
    errorStaff: string;

    successCode: boolean;
    successProfileUser: boolean,
    successUser: boolean;
    successAuth: boolean;
    successLogout: boolean;
    successUsers: boolean;
    successStaff: boolean;
}

export interface RegisterData {
    type: 'IND' | 'LGL';
    legalType?: 'ЮЛ' | 'ИП';
    fullName?: string;
    legalId?: string;
    email: string;
    password: string;
    bankAccount?: {
        accountNumber?: string;
        bankName?: string;
        bik?: string;
        correspondentAccount?: string;
    };
    // Согласия пользователя (обязательны при регистрации)
    personalDataConsent?: boolean;
    userAgreementConsent?: boolean;
    cookieConsent?: boolean; // Может быть получено ранее через cookie banner
}
