import { FC, useState } from "react";
import styles from "./Accordion.module.sass";

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    isOpen?: boolean;
    onToggle?: () => void;
}

export const Accordion: FC<AccordionProps> = ({
                                                  title,
                                                  children,
                                                  isOpen = false,
                                                  onToggle
                                              }) => {
    const [localOpen, setLocalOpen] = useState(isOpen);

    const handleToggle = () => {
        setLocalOpen(!localOpen);
        onToggle?.();
    };

    return (
        <div className={`${styles.accordion} ${localOpen ? styles.open : ""}`}>
            <button
                className={styles.header}
                onClick={handleToggle}
                aria-expanded={localOpen}
                aria-controls={`accordion-content-${title}`}
            >
                <span>{title}</span>
                <svg
                    className={styles.arrow}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M7 10l5 5 5-5z" />
                </svg>
            </button>

            <div
                id={`accordion-content-${title}`}
                className={styles.content}
                hidden={!localOpen}
            >
                {children}
            </div>
        </div>
    );
};