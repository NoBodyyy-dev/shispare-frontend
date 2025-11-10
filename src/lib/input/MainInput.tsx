import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import styles from "./input.module.sass";

interface MainInputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string | string[]; // <-- можно передавать массив или одну строку
    label?: ReactNode;
    containerClassName?: string;
}

export const MainInput = forwardRef<HTMLInputElement, MainInputProps>(
    ({ error, label, containerClassName, className, ...props }, ref) => {
        const errorsArray = Array.isArray(error) ? error : error ? [error] : [];

        return (
            <div className={`${styles.inputContainer} ${containerClassName || ""}`}>
                {label && (
                    <label className={styles.inputLabel}>
                        {label}
                    </label>
                )}

                <input
                    {...props}
                    ref={ref}
                    className={`${styles.inputMain} ${className || ""} ${errorsArray.length ? styles.inputError : ""}`}
                />

                {errorsArray.length > 0 && (
                    <div className="font-roboto color-red">
                        {errorsArray.map((err, i) => (
                            <p key={i} className={styles.errorText}>
                                {err}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);

MainInput.displayName = "MainInput";