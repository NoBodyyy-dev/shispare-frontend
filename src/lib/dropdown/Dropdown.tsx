import {FC, ReactNode, useEffect, useRef, useState} from "react";
import {FiChevronDown} from "react-icons/fi";
import clsx from "clsx";
import styles from "./dropdown.module.sass";

export type DropdownOption = {
    label: string;
    value: string;
    meta?: string;
    disabled?: boolean;
};

type DropdownProps = {
    label?: string;
    value?: string;
    placeholder?: string;
    options: DropdownOption[];
    renderOption?: (option: DropdownOption, isActive: boolean) => ReactNode;
    onChange: (value: string, option?: DropdownOption) => void;
    disabled?: boolean;
    className?: string;
    error?: string;
    children?: ReactNode; // Кастомный контент для dropdown
};

export const Dropdown: FC<DropdownProps> = ({
    label,
    value,
    placeholder = "Выберите значение",
    options,
    renderOption,
    onChange,
    disabled = false,
    className,
    error,
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: DropdownOption) => {
        if (option.disabled) return;
        onChange(option.value, option);
        setIsOpen(false);
    };

    return (
        <div className={clsx(styles.dropdown, className, disabled && styles.disabled)} ref={containerRef}>
            {label && <span className={styles.label}>{label}</span>}

            <button
                type="button"
                className={clsx(styles.control, error && styles.errorBorder)}
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={clsx((!selectedOption && !value) && styles.placeholder)}>
                    {selectedOption ? selectedOption.label : (value || placeholder)}
                </span>
                <FiChevronDown className={clsx(styles.icon, isOpen && styles.iconOpened)} />
            </button>

            {isOpen && (
                <div className={styles.menu} role="listbox">
                    {children ? (
                        children
                    ) : (
                        <>
                            {options.length === 0 && <div className={styles.empty}>Нет вариантов</div>}
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={clsx(
                                        styles.option,
                                        option.value === value && styles.optionActive,
                                        option.disabled && styles.optionDisabled
                                    )}
                                    onClick={() => handleSelect(option)}
                                    disabled={option.disabled}
                                >
                                    {renderOption ? (
                                        renderOption(option, option.value === value)
                                    ) : (
                                        <>
                                            <span>{option.label}</span>
                                            {option.meta && <small>{option.meta}</small>}
                                        </>
                                    )}
                                </button>
                            ))}
                        </>
                    )}
                </div>
            )}

            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

