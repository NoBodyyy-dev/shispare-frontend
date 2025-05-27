import {forwardRef, InputHTMLAttributes} from 'react'
import styles from "./input.module.sass"

export const MainInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    (props, ref) => {
        return <input {...props} ref={ref} className={`${props.className} ${styles.inputMain}`} />;
    }
);