import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useAppDispatch } from "../../hooks/state.hook.ts";
import * as action from "../../store/actions/user.action.ts";
import styles from "./auth.module.sass"
import {MainInput} from "../../lib/input/MainInput.tsx";

export const CodeVerification = () => {
    const dispatch = useAppDispatch();
    const [code, setCode] = useState<string[]>(new Array(6).fill(''));
    const inputsRef = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        const fullCode = code.join('');
        if (fullCode.length === 6) {
            dispatch(action.verifyCodeFunc({ code: fullCode }));
        }
    }, [code, dispatch]);

    const handleChange = (value: string, index: number) => {
        const numericValue = value.replace(/\D/g, '');
        if (!numericValue && value) return; // Блокируем не-цифры

        const newCode = [...code];
        newCode[index] = numericValue;
        setCode(newCode);

        // Переход к следующему инпуту при вводе цифры
        if (numericValue && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newCode = [...code];

            if (newCode[index] !== '') {
                // Очищаем текущий инпут
                newCode[index] = '';
                setCode(newCode);
            } else if (index > 0) {
                // Переходим к предыдущему инпуту и очищаем его
                newCode[index - 1] = '';
                setCode(newCode);
                inputsRef.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const newCode = pastedData.split('').slice(0, 6);
            setCode([...newCode, ...Array(6 - newCode.length).fill('')]);
            inputsRef.current[Math.min(newCode.length - 1, 5)].focus();
        }
    };

    return (
        <div className="verification-form">
            <h1 className="title">Введите код из письма</h1>
            <p className="font-roboto">Вам придет код на электронную почту</p>
            <div className={styles.verifyContainer}>
                {code.map((digit, index) => (
                    <MainInput
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        ref={(el) => el && (inputsRef.current[index] = el)}
                        className="code-input"
                        pattern="[0-9]*"
                        autoFocus={index === 0}
                    />
                ))}
            </div>

        </div>
    );
};