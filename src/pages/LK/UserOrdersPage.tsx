import {useEffect, useMemo, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";
import {useSocket} from "../../context/SocketContext.tsx";
import {IOrder, OrderStatus} from "../../store/interfaces/order.interface.ts";
import styles from "./UserOrdersPage.module.sass";

const STATUS_LABEL: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "В ожидании",
    [OrderStatus.PROCESSING]: "В обработке",
    [OrderStatus.CONFIRMED]: "Подтвержден",
    [OrderStatus.SHIPPED]: "Отправлен",
    [OrderStatus.DELIVERED]: "Доставлен",
    [OrderStatus.CANCELLED]: "Отменен",
    [OrderStatus.REFUNDED]: "Возвращен",
};

export const UserOrdersPage = () => {
    const {id: userId} = useParams();
    const {user} = useAuth();
    const {orders, getOrders} = useSocket();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<OrderStatus | "all">("all");

    useEffect(() => {
        if (!orders || orders.length === 0) getOrders();
    }, []);

    const filtered = useMemo(() => {
        const forUser = orders.filter(o => o.owner._id === (userId || user?._id));
        const byStatus = status === "all" ? forUser : forUser.filter(o => o.status === status);
        const bySearch = search.trim()
            ? byStatus.filter(o => o.orderNumber.replace(/^ORD-/, "").startsWith(search.trim()))
            : byStatus;
        return bySearch;
    }, [orders, userId, user?._id, search, status]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className="title">Мои заказы</h1>
                <Link className={styles.backLink} to={`/lk/${userId || user?._id}`}>Назад в профиль</Link>
            </div>

            <div className={styles.filters}>
                <input
                    className={styles.search}
                    placeholder="Поиск по номеру (без ORD-)"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select className={styles.select} value={status} onChange={e => setStatus(e.target.value as any)}>
                    <option value="all">Все</option>
                    {Object.values(OrderStatus).map(s => (
                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                </select>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>№ заказа</th>
                        <th>Дата</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.length ? filtered.map((o: IOrder) => (
                        <tr key={o._id} className={styles.row}>
                            <td>{o.orderNumber}</td>
                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                            <td>{o.finalAmount.toLocaleString()} ₽</td>
                            <td className={`${styles.status} ${styles[o.status]}`}>{STATUS_LABEL[o.status]}</td>
                            <td>
                                <Link to={`/orders/${o._id}`}>Открыть</Link>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className={styles.empty}>Заказы не найдены</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserOrdersPage;
