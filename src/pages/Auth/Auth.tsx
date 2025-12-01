import {FormEvent, useCallback, useEffect, useState} from 'react';
import styles from "./auth.module.sass";
import {AuthForm} from "./AuthForm.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {authenticateFunc, registerFunc} from "../../store/actions/user.action.ts";
import {RegisterForm} from "./RegisterForm.tsx";
import {useNavigate} from "react-router-dom";
import {getCookie} from "../../utils/cookie.ts";

const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) errors.push("Минимум 8 символов");
    if (!/[A-Z]/.test(password)) errors.push("Хотя бы одна заглавная буква");
    if (!/[0-9]/.test(password)) errors.push("Хотя бы одна цифра");

    return {isValid: errors.length === 0, errors};
};

export const Auth = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {isAuthenticated, isLoadingAuthenticated} = useAppSelector(state => state.user);
    const [isAuth, setIsAuth] = useState<boolean>(true);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const [authData, setAuthData] = useState({
        email: "",
        password: ""
    });

    const [registerData, setRegisterData] = useState({
        type: "IND" as "IND" | "LGL",
        legalType: "ИП" as "ИП" | "ЮЛ",
        fullName: "",
        legalId: "",
        email: "",
        password: "",
        confirmPassword: "",
        personalDataConsent: false,
        userAgreementConsent: false,
        cookieConsent: false, // Будет заполнено из localStorage при необходимости
    });

    // Загружаем согласие на cookie из cookie или localStorage при монтировании
    useEffect(() => {
        const cookieConsentValue = getCookie("cookieConsent");
        const localStorageConsent = localStorage.getItem("cookieConsent");
        
        // Проверяем cookie в первую очередь, потом localStorage
        let hasConsent = false;
        if (cookieConsentValue) {
            // Если cookie есть и не начинается с "declined_", значит согласие дано
            hasConsent = !cookieConsentValue.startsWith("declined_");
        } else if (localStorageConsent) {
            try {
                const consentData = JSON.parse(localStorageConsent);
                hasConsent = consentData.accepted === true;
            } catch (e) {
                // Игнорируем ошибки парсинга
            }
        }
        
        if (hasConsent) {
            setRegisterData(prev => ({...prev, cookieConsent: true}));
        }
    }, []);

    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string[]> = {};

        if (isAuth) {
            if (!authData.email || !authData.email.trim()) {
                newErrors.email = ["Email обязателен"];
            } else if (!validateEmail(authData.email)) {
                newErrors.email = ["Некорректный email"];
            }

            if (!authData.password || !authData.password.trim()) {
                newErrors.password = ["Пароль обязателен"];
            }
        } else {
            if (!registerData.email || !registerData.email.trim()) {
                newErrors.email = ["Email обязателен"];
            } else if (!validateEmail(registerData.email)) {
                newErrors.email = ["Некорректный email"];
            }

            const passwordValidation = validatePassword(registerData.password);
            if (!registerData.password || !registerData.password.trim()) {
                newErrors.password = ["Пароль обязателен"];
            } else if (!passwordValidation.isValid) {
                newErrors.password = passwordValidation.errors;
            }

            if (registerData.password !== registerData.confirmPassword) {
                newErrors.confirmPassword = ["Пароли не совпадают"];
            }

            if (registerData.type === "IND") {
                if (!registerData.fullName || registerData.fullName.trim().split(' ').length < 2) {
                    newErrors.fullName = ["Укажите полное ФИО (минимум 2 слова)"];
                }
            } else {
                if (!registerData.legalId || !/^\d{10,15}$/.test(registerData.legalId)) {
                    newErrors.legalId = ["Укажите корректный ИНН/ОГРН (10-15 цифр)"];
                }
            }

            // Проверка обязательных согласий при регистрации
            if (!registerData.personalDataConsent) {
                newErrors.personalDataConsent = ["Необходимо согласие на обработку персональных данных"];
            }

            if (!registerData.userAgreementConsent) {
                newErrors.userAgreementConsent = ["Необходимо согласие с пользовательским соглашением"];
            }
        }

        setErrors(newErrors);
        
        // Возвращаем false если есть ошибки
        return Object.keys(newErrors).length === 0;
    }, [isAuth, authData, registerData]);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();

        // Валидация формы - если есть ошибки, не отправляем
        if (!validateForm()) {
            return;
        }

        // Очищаем предыдущие ошибки перед отправкой
        setErrors({});

        try {
            if (isAuth) {
                const result = await dispatch(authenticateFunc(authData));
                
                if (authenticateFunc.rejected.match(result)) {
                    // Обрабатываем ошибки с сервера
                    const errorPayload = result.payload as any;
                    const serverErrors: Record<string, string[]> = {};
                    
                    console.log("Auth error payload:", errorPayload);
                    
                    // Вариант 1: Ошибки в формате { errors: { field: ["error"] } }
                    if (errorPayload?.errors && typeof errorPayload.errors === 'object') {
                        Object.keys(errorPayload.errors).forEach((field) => {
                            const fieldErrors = errorPayload.errors[field];
                            if (Array.isArray(fieldErrors)) {
                                serverErrors[field] = fieldErrors;
                            } else if (typeof fieldErrors === 'string') {
                                serverErrors[field] = [fieldErrors];
                            }
                        });
                    }
                    // Вариант 2: Ошибки в формате { field: ["error"] } напрямую
                    else if (errorPayload && typeof errorPayload === 'object') {
                        Object.keys(errorPayload).forEach((key) => {
                            if (key !== 'message' && key !== 'errors') {
                                const value = errorPayload[key];
                                if (Array.isArray(value)) {
                                    serverErrors[key] = value;
                                } else if (typeof value === 'string') {
                                    serverErrors[key] = [value];
                                }
                            }
                        });
                    }
                    // Вариант 3: Общая ошибка в message
                    if (errorPayload?.message && Object.keys(serverErrors).length === 0) {
                        const message = errorPayload.message.toLowerCase();
                        if (message.includes('email') || message.includes('почт') || message.includes('почта')) {
                            serverErrors.email = [errorPayload.message];
                        } else if (message.includes('password') || message.includes('парол') || message.includes('пароль')) {
                            serverErrors.password = [errorPayload.message];
                        } else {
                            // Общая ошибка - показываем в email поле
                            serverErrors.email = [errorPayload.message];
                        }
                    }
                    
                    if (Object.keys(serverErrors).length > 0) {
                        console.log("Setting server errors:", serverErrors);
                        setErrors(serverErrors);
                    }
                    return;
                }
                
                // Если успешно, переходим на страницу подтверждения
                if (authenticateFunc.fulfilled.match(result)) {
                    navigate("/auth/confirm");
                }
            } else {
                // Убираем confirmPassword и отправляем только нужные поля
                const {confirmPassword, ...registerPayload} = registerData;
                
                // Проверяем cookieConsent из cookie или localStorage, если его нет в данных
                if (!registerPayload.cookieConsent) {
                    const cookieConsentValue = getCookie("cookieConsent");
                    const localStorageConsent = localStorage.getItem("cookieConsent");
                    
                    let hasConsent = false;
                    if (cookieConsentValue) {
                        // Если cookie есть и не начинается с "declined_", значит согласие дано
                        hasConsent = !cookieConsentValue.startsWith("declined_");
                    } else if (localStorageConsent) {
                        try {
                            const consentData = JSON.parse(localStorageConsent);
                            hasConsent = consentData.accepted === true;
                        } catch (e) {
                            // Игнорируем ошибки парсинга
                        }
                    }
                    
                    if (hasConsent) {
                        registerPayload.cookieConsent = true;
                    }
                }
                
                const result = await dispatch(registerFunc(registerPayload));
                
                if (registerFunc.rejected.match(result)) {
                    // Обрабатываем ошибки с сервера
                    const errorPayload = result.payload as any;
                    const serverErrors: Record<string, string[]> = {};
                    
                    console.log("Register error payload:", errorPayload);
                    
                    // Вариант 1: Ошибки в формате { errors: { field: ["error"] } }
                    if (errorPayload?.errors && typeof errorPayload.errors === 'object') {
                        Object.keys(errorPayload.errors).forEach((field) => {
                            const fieldErrors = errorPayload.errors[field];
                            if (Array.isArray(fieldErrors)) {
                                serverErrors[field] = fieldErrors;
                            } else if (typeof fieldErrors === 'string') {
                                serverErrors[field] = [fieldErrors];
                            }
                        });
                    }
                    // Вариант 2: Ошибки в формате { field: ["error"] } напрямую
                    else if (errorPayload && typeof errorPayload === 'object') {
                        Object.keys(errorPayload).forEach((key) => {
                            if (key !== 'message' && key !== 'errors') {
                                const value = errorPayload[key];
                                if (Array.isArray(value)) {
                                    serverErrors[key] = value;
                                } else if (typeof value === 'string') {
                                    serverErrors[key] = [value];
                                }
                            }
                        });
                    }
                    // Вариант 3: Общая ошибка в message
                    if (errorPayload?.message && Object.keys(serverErrors).length === 0) {
                        const message = errorPayload.message.toLowerCase();
                        if (message.includes('email') || message.includes('почт') || message.includes('почта')) {
                            serverErrors.email = [errorPayload.message];
                        } else if (message.includes('password') || message.includes('парол') || message.includes('пароль')) {
                            serverErrors.password = [errorPayload.message];
                        } else if (message.includes('fullname') || message.includes('фио') || message.includes('имя') || message.includes('name')) {
                            serverErrors.fullName = [errorPayload.message];
                        } else if (message.includes('legal') || message.includes('инн') || message.includes('огрн')) {
                            serverErrors.legalId = [errorPayload.message];
                        } else if (message.includes('personal') || message.includes('персональн')) {
                            serverErrors.personalDataConsent = [errorPayload.message];
                        } else if (message.includes('agreement') || message.includes('соглашен')) {
                            serverErrors.userAgreementConsent = [errorPayload.message];
                        } else {
                            // Общая ошибка - показываем в email поле
                            serverErrors.email = [errorPayload.message];
                        }
                    }
                    
                    if (Object.keys(serverErrors).length > 0) {
                        console.log("Setting server errors:", serverErrors);
                        setErrors(serverErrors);
                    }
                    return;
                }
                
                // Если успешно, переходим на страницу подтверждения
                if (registerFunc.fulfilled.match(result)) {
                    navigate("/auth/confirm");
                }
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    }, [isAuth, authData, registerData, dispatch, validateForm, navigate]);

    const toggleAuthMode = useCallback(() => {
        setIsAuth(prev => !prev);
        setErrors({});
    }, []);

    useEffect(() => {
        if (isAuthenticated) setAuthData({email: "", password: ""});
    }, [isAuthenticated]);

    return (
        <div className={`${styles.auth} p-20`}>
            <div className={styles.authContainer}>
                <form className={styles.authBlock} onSubmit={handleSubmit}>
                    {isAuth ? (
                        <AuthForm
                            data={authData}
                            setData={setAuthData}
                            errors={errors}
                        />
                    ) : (
                        <RegisterForm
                            data={registerData}
                            setData={setRegisterData}
                            errors={errors}
                        />
                    )}

                    <div className="flex-align-center-sbetw mt-15 mb-15">
                        <p>{isAuth ? "Нет аккаунта?" : "Есть аккаунт?"}</p>
                        <p
                            className="color-blue"
                            onClick={toggleAuthMode}
                        >
                            {isAuth ? "Зарегистрироваться" : "Войти"}
                        </p>
                    </div>

                    <Button type="submit" className="full-width" loading={isLoadingAuthenticated}>
                        {isAuth ? "Войти" : "Зарегистрироваться"}
                    </Button>
                </form>
            </div>
        </div>
    );
};