import {FC, ButtonHTMLAttributes, ReactNode, memo} from "react";
import {Spin} from "../loaders/Spin.tsx";
import styles from "./button.module.sass"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    loading?: boolean;
    square?: boolean;
}

export const Button: FC<Props> = memo(({loading = false, square = false, children, ...attributes}: Props) => {
    return <button {...attributes} className={`${styles.button} ${square ? styles.square : ""}`}>{loading ? <Spin/> : children}</button>;
})
