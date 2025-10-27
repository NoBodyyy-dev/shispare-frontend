import {FC, ButtonHTMLAttributes, ReactNode, memo} from "react";
import {Spin} from "../loaders/Spin.tsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    loading?: boolean;
}

export const Button: FC<Props> = memo(({loading = false, children, ...attributes}: Props) => {
    return <button {...attributes}>{loading ? <Spin/> : children}</button>;
})
