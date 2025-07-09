import {FormEvent, useCallback, useEffect, useState} from 'react';
import styles from "./auth.module.sass";
import {AuthForm} from "./AuthForm.tsx";
import Button from "../../lib/buttons/Button.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {authenticateFunc, registerFunc} from "../../store/actions/user.action.ts";
import {RegisterForm} from "./RegisterForm.tsx";
import {addMessage} from "../../store/slices/push.slice.ts";

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
    const {isAuthenticated} = useAppSelector(state => state.user);
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
    });

    const showError = useCallback((message: string) => {
        dispatch(addMessage(message));
    }, [dispatch]);

    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string[]> = {};
        let hasErrors = false;

        if (isAuth) {
            if (!authData.email) {
                newErrors.email = ["Email обязателен"];
                hasErrors = true;
            } else if (!validateEmail(authData.email)) {
                newErrors.email = ["Некорректный email"];
                hasErrors = true;
            }

            if (!authData.password) {
                newErrors.password = ["Пароль обязателен"];
                hasErrors = true;
            }
        } else {
            if (!registerData.email) {
                newErrors.email = ["Email обязателен"];
                hasErrors = true;
            } else if (!validateEmail(registerData.email)) {
                newErrors.email = ["Некорректный email"];
                hasErrors = true;
            }

            const passwordValidation = validatePassword(registerData.password);
            if (!registerData.password) {
                newErrors.password = ["Пароль обязателен"];
                hasErrors = true;
            } else if (!passwordValidation.isValid) {
                newErrors.password = passwordValidation.errors;
                hasErrors = true;
            }

            if (registerData.password !== registerData.confirmPassword) {
                newErrors.confirmPassword = ["Пароли не совпадают"];
                hasErrors = true;
            }

            if (registerData.type === "IND") {
                if (!registerData.fullName || registerData.fullName.trim().split(' ').length < 2) {
                    newErrors.fullName = ["Укажите полное ФИО"];
                    hasErrors = true;
                }
            } else {
                if (!registerData.legalId || !/^\d{10,15}$/.test(registerData.legalId)) {
                    newErrors.legalId = ["Укажите корректный ИНН/ОГРН"];
                    hasErrors = true;
                }
            }
        }

        setErrors(newErrors);

        if (hasErrors) {
            Object.values(newErrors).forEach((error) => {
                showError(`${error}`)
            })
            return false;
        }

        return true;
    }, [isAuth, authData, registerData, showError]);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            if (isAuth) await dispatch(authenticateFunc(authData));
            else await dispatch(registerFunc(registerData));
        } catch (error) {
            showError(error instanceof Error ? error.message : "Произошла ошибка");
        }
    }, [isAuth, authData, registerData, dispatch, validateForm, showError]);

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
                        />
                    ) : (
                        <RegisterForm
                            data={registerData}
                            setData={setRegisterData}
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

                    <Button type="submit" className="full-width">
                        {isAuth ? "Войти" : "Зарегистрироваться"}
                    </Button>
                </form>
            </div>
        </div>
    );
};