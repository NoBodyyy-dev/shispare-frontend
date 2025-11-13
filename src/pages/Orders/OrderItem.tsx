import {memo, useState} from "react";
import {IOrder, OrderStatus} from "../../store/interfaces/order.interface.ts";
import {useSocket} from "../../context/SocketContext.tsx";
import {StatusSelect} from "./StatusSelect.tsx";
import styles from "./orders.module.sass";
import {Link} from "react-router-dom";

type Props = {
    order: IOrder;
    search: string;
};
export const OrderItem = memo(({order, search}: Props) => {
    const {updateOrderStatus} = useSocket();
    const [disabled, setDisabled] = useState(false);

    const handleChangeStatus = (status: OrderStatus, cancellationReason?: string, deliveryDate?: string) => {
        updateOrderStatus(order._id, status, cancellationReason, deliveryDate);
        setDisabled(true);
    };

    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;
        const prefix = "ORD-";
        const digits = text.replace(/^ORD-/, "");
        const queryTrimmed = query.trim();

        if (!digits.startsWith(queryTrimmed)) return text;

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
        <tr className={styles.row}>
            <td><Link to={`/orders/${order.orderNumber}`}>{highlightMatch(order.orderNumber, search)}</Link></td>
            <td>{order.owner.fullName}</td>
            <td>{order.finalAmount} ₽</td>
            <td>
                <StatusSelect
                    current={order.status}
                    onChange={handleChangeStatus}
                    disabled={disabled}
                />
            </td>
            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
        </tr>
    );
});