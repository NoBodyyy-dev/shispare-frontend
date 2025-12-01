import {useState, useRef, useEffect, KeyboardEvent} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {checkVerifyFunc, verifyCodeFunc, getMeFunc} from "../../store/actions/user.action.ts";
import {addMessage} from "../../store/slices/push.slice.ts";
import {Button} from "../../lib/buttons/Button.tsx";
import {MainInput} from "../../lib/input/MainInput.tsx";
import styles from "./auth.module.sass";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";
import {syncCart} from "../../store/actions/cart.action.ts";

export const CodeVerification = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {isLoadingVerify, errorVerify, curUser} = useAppSelector((state) => state.user);
    const {isAuthenticated} = useAuth();

    const [code, setCode] = useState<string[]>(new Array(6).fill(""));
    const inputsRef = useRef<HTMLInputElement[]>([]);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const [resendTimer, setResendTimer] = useState<number>(() => {
        const savedTimer = localStorage.getItem('resendTimer');
        return savedTimer ? Math.max(0, parseInt(savedTimer)) : 60;
    });

    const [canResend, setCanResend] = useState<boolean>(() => {
        const savedTimer = localStorage.getItem('resendTimer');
        return savedTimer ? parseInt(savedTimer) <= 0 : false;
    });

    const isSubmittingRef = useRef(false);

    useEffect(() => {
        localStorage.setItem('resendTimer', resendTimer.toString());

        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
            setCanResend(false);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    useEffect(() => {
        if (errorVerify) dispatch(addMessage({text: errorVerify, type: "error"}));
    }, [errorVerify]);

    useEffect(() => {
        const fullCode = code.join('');
        if (fullCode.length === 6 && !isSubmittingRef.current && !isLoadingVerify) {
            // Небольшая задержка перед автоматической отправкой
            const timer = setTimeout(() => {
                handleSubmit();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [code]);

    useEffect(() => {
        dispatch(checkVerifyFunc()).unwrap().then(data => {
            if (!data.success) navigate("/auth");
        })
    }, []);

    useEffect(() => {
        // Редирект происходит только после загрузки данных пользователя
        if (isAuthenticated && curUser && Object.keys(curUser).length > 0) {
            navigate("/");
        }
    }, [isAuthenticated, curUser, navigate])

    const handleChange = (value: string, index: number) => {
        const numeric = value.replace(/\D/g, "");
        if (!numeric && value) return;

        const newCode = [...code];
        newCode[index] = numeric;
        setCode(newCode);
        
        // Очищаем ошибки при изменении кода
        if (errors.code || errors.general) {
            setErrors({});
        }

        if (numeric && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newCode = [...code];
            if (newCode[index]) {
                newCode[index] = "";
                setCode(newCode);
            } else if (index > 0) {
                newCode[index - 1] = "";
                setCode(newCode);
                inputsRef.current[index - 1]?.focus();
            }
        }
        if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
        if (e.key === "ArrowRight" && index < 5) inputsRef.current[index + 1]?.focus();

        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (/^\d+$/.test(pasted)) {
            const newCode = pasted.split("");
            setCode([...newCode, ...Array(6 - newCode.length).fill("")]);
            const focusIndex = Math.min(newCode.length, 5);
            inputsRef.current[focusIndex]?.focus();
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (isSubmittingRef.current) return;

        const fullCode = code.join("");
        
        // Валидация кода
        if (fullCode.length !== 6) {
            setErrors({ code: ["Введите полный 6-значный код"] });
            return;
        }
        
        isSubmittingRef.current = true;
        setErrors({});

        try {
            const result = await dispatch(verifyCodeFunc({code: fullCode}));
            
            if (verifyCodeFunc.rejected.match(result)) {
                const errorPayload = result.payload as any;
                const serverErrors: Record<string, string[]> = {};
                
                console.log("Verify code error payload:", errorPayload);
                
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
                    serverErrors.code = [errorPayload.message];
                }
                
                console.log("Setting server errors:", serverErrors);
                
                if (Object.keys(serverErrors).length > 0) {
                    setErrors(serverErrors);
                    // Очищаем код при ошибке
                    setCode(new Array(6).fill(""));
                    setTimeout(() => {
                        inputsRef.current[0]?.focus();
                    }, 100);
                } else {
                    // Если ошибки не распознаны, показываем общую ошибку
                    setErrors({ code: ["Неверный код подтверждения"] });
                    setCode(new Array(6).fill(""));
                    setTimeout(() => {
                        inputsRef.current[0]?.focus();
                    }, 100);
                }
                return;
            }
            
            if (verifyCodeFunc.fulfilled.match(result)) {
                dispatch(addMessage({text: "Код подтвержден", type: "success"}));
                
                // Загружаем данные пользователя после успешной верификации
                try {
                    await dispatch(getMeFunc()).unwrap();
                } catch (error) {
                    console.error("Ошибка загрузки данных пользователя:", error);
                    dispatch(addMessage({text: "Ошибка загрузки данных пользователя", type: "error"}));
                }
                
                // Синхронизируем корзину после загрузки пользователя
                const localCart = localStorage.getItem("cart");
                if (localCart) {
                    try {
                        const cartItems = JSON.parse(localCart);
                        if (Array.isArray(cartItems) && cartItems.length > 0) {
                            const items = cartItems
                                .map((item: any) => ({
                                    productId: item.product?._id || item.productId,
                                    article: item.article,
                                    quantity: item.quantity || 1,
                                }))
                                .filter((item: any) => item.productId && item.article);
                            
                            if (items.length > 0) {
                                await dispatch(syncCart(items)).unwrap();
                            }
                        }
                    } catch (e) {
                        console.error("Ошибка синхронизации корзины:", e);
                    }
                }
            }
        } catch (err: any) {
            const errorMessage = err?.message || "Ошибка подтверждения кода";
            setErrors({ code: [errorMessage] });
            dispatch(addMessage({text: errorMessage, type: "error"}));
        } finally {
            isSubmittingRef.current = false;
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        setErrors({});
        try {
            const api = (await import("../../store/api")).default;
            await api.post("/auth/resend");
            dispatch(addMessage({text: "Код отправлен повторно", type: "info"}));
            setResendTimer(60);
            setCanResend(false);
            setCode(new Array(6).fill(""));
            inputsRef.current[0]?.focus();
            localStorage.setItem('resendTimer', '60');
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || "Ошибка при повторной отправке";
            dispatch(addMessage({text: errorMessage, type: "error"}));
        }
    };

    return (
        <div className="main__container flex-to-center-col">
            <form onSubmit={handleSubmit} className={`${styles.auth} p-20`}>
                <h1 className="title center">Введите код из письма</h1>
                <p className="font-roboto center muted">
                    Мы отправили 6-значный код на вашу почту. Введите его ниже.
                </p>

                <div className={styles.verifyContainer}>
                    {code.map((digit, index) => (
                        <MainInput
                            key={index}
                            ref={(el) => el && (inputsRef.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            className={styles.codeInput}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            autoFocus={index === 0}
                            disabled={isLoadingVerify}
                        />
                    ))}
                </div>
                {errors.code && errors.code.length > 0 && (
                    <div className="error-text center" style={{ marginTop: '12px', marginBottom: '12px' }}>
                        {errors.code.map((err, i) => (
                            <div key={i} style={{ color: '#f44336', fontSize: '14px' }}>{err}</div>
                        ))}
                    </div>
                )}

                <div className={styles.verifyActions}>
                    <Button
                        type="button"
                        className={`${styles.btnLink} ${!canResend ? styles.disabled : ""} full-width`}
                        onClick={handleResend}
                        disabled={!canResend || isLoadingVerify}
                    >
                        {canResend
                            ? "Отправить код повторно"
                            : `Отправить снова через ${resendTimer}s`}
                    </Button>
                </div>
            </form>
        </div>
    );
};