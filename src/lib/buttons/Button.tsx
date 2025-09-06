import {FC, ButtonHTMLAttributes, ReactNode, memo} from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    loading?: boolean;
}

export const Button: FC<Props> = memo(({loading = false, children, ...attributes}: Props) => {
    return <button {...attributes}>{loading ? "Загрузка" : children}</button>;
})
