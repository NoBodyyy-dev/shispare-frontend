import {OrderStatus} from "../../store/interfaces/order.interface.ts";
import styles from "./orders.module.sass";

type Props = {
    current: OrderStatus;
    onChange: (status: OrderStatus) => void;
    disabled?: boolean;
};

const STATUS_OPTIONS: {label: string; value: OrderStatus}[] = [
    {label: "Подтвержден", value: OrderStatus.CONFIRMED},
    {label: "Отправлен", value: OrderStatus.SHIPPED},
    {label: "Доставлен", value: OrderStatus.DELIVERED},
    {label: "Отменен", value: OrderStatus.CANCELLED},
    {label: "Возвращен", value: OrderStatus.REFUNDED},
];

export const StatusSelect = ({current, onChange, disabled}: Props) => {
    return (
        <select
            className={styles.select}
            value={current}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value as OrderStatus)}
        >
            {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                    {s.label}
                </option>
            ))}
        </select>
    );
};