import {useState, useRef, useEffect, KeyboardEvent} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {checkVerifyFunc, verifyCodeFunc} from "../../store/actions/user.action.ts";
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
    const {isLoadingVerify, errorVerify} = useAppSelector((state) => state.user);
    const {isAuthenticated} = useAuth();

    const [code, setCode] = useState<string[]>(new Array(6).fill(""));
    const inputsRef = useRef<HTMLInputElement[]>([]);

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
        if (fullCode.length === 6) {
            dispatch(verifyCodeFunc({code: fullCode}));
        }
    }, [code, dispatch]);

    useEffect(() => {
        dispatch(checkVerifyFunc()).unwrap().then(data => {
            if (!data.success) navigate("/auth");
        })
    }, []);

    useEffect(() => {
        if (isAuthenticated) navigate("/")
    }, [isAuthenticated])

    const handleChange = (value: string, index: number) => {
        const numeric = value.replace(/\D/g, "");
        if (!numeric && value) return;

        const newCode = [...code];
        newCode[index] = numeric;
        setCode(newCode);

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
        isSubmittingRef.current = true;

        try {
            await dispatch(verifyCodeFunc({code: fullCode})).unwrap();
            dispatch(addMessage({text: "Код подтвержден", type: "success"}));
            
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
        } catch (err: any) {
            dispatch(addMessage({text: err?.message || "Ошибка подтверждения кода", type: "error"}));
        } finally {
            isSubmittingRef.current = false;
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
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
            dispatch(addMessage({text: err?.message || "Ошибка при повторной отправке", type: "error"}));
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