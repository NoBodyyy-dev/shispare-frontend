import {
    useEffect,
    forwardRef,
    RefObject,
    TextareaHTMLAttributes,
} from 'react';
import styles from "./input.module.sass"

export const MainTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
    (props, ref) => {
        useEffect(() => {
            const textarea = (ref as RefObject<HTMLTextAreaElement>)?.current;
            if (!textarea) return;

            // Сброс высоты перед вычислением
            textarea.style.height = 'auto';

            const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 20;
            const maxHeight = lineHeight * 5; // максимум 5 строк

            const scrollHeight = textarea.scrollHeight;
            const newHeight = Math.min(scrollHeight, maxHeight);

            textarea.style.height = `${newHeight}px`;
            textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';

            // Добавляем / убираем класс при переполнении
            if (scrollHeight > maxHeight) {
                textarea.classList.add(styles.scroll);
            } else {
                textarea.classList.remove(styles.scroll);
            }
        }, [props.value]);


        return (
            <textarea
                {...props}
                ref={ref}
                rows={1}
                readOnly={false}
                className={styles.textarea}
            />
        );
    }
);