import {memo} from "react";
import {IOrder} from "../../store/interfaces/order.interface.ts";
import styles from "./orders.module.sass";

type Props = {
    order: IOrder;
    search: string;
    status: string;
    onClick: () => void;
};

export const OrderItem = memo(({order, search, onClick, status}: Props) => {
    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;

        const prefix = "ORD-";
        const digits = text.replace(/^ORD-/, "");
        const queryTrimmed = query.trim();

        if (!digits.startsWith(queryTrimmed)) {
            return text;
        }

        return (
            <>
                {prefix}
                <mark className={styles.highlight}>
                    {digits.substring(0, queryTrimmed.length)}
                </mark>
                {digits.substring(queryTrimmed.length)}
            </>
        );
    };

    return (
        <tr className={styles.row} onClick={onClick}>
            <td>{highlightMatch(order.orderNumber, search)}</td>
            <td>{order.owner.fullName}</td>
            <td>{order.finalAmount.toLocaleString()} ₽</td>
            <td>{status}</td>
            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
        </tr>
    );
});