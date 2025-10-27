import {useSocket} from "../../context/SocketContext.tsx";
import {useEffect, useMemo, useState} from "react";
import {IOrder, OrderStatus} from "../../store/interfaces/order.interface.ts";
import {OrderItem} from "./OrderItem.tsx";
import styles from "./orders.module.sass";

const TABS: { label: string; value: OrderStatus, statusLabel: string }[] = [
    {label: "В ожидании", value: OrderStatus.PENDING, statusLabel: "В ожидании"},
    {label: "Подтвержденные", value: OrderStatus.CONFIRMED, statusLabel: "Подтвержден"},
    {label: "Отправленные", value: OrderStatus.SHIPPED, statusLabel: "Отправлен"},
    {label: "Доставленные", value: OrderStatus.DELIVERED, statusLabel: "Доставлен"},
    {label: "Отмененные", value: OrderStatus.CANCELLED, statusLabel: "Отменен"},
    {label: "Возвращенные", value: OrderStatus.REFUNDED, statusLabel: "Возвращен"},
];

export const OrdersPage = () => {
    const {getOrders, orders} = useSocket();
    const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.PENDING);
    const [search, setSearch] = useState("");
    useEffect(() => {
        getOrders();
    }, []);

    useEffect(() => {
        console.log('Orders:', orders);
    }, [orders]);

    const filteredOrders = useMemo(() => {
        return orders
            .filter((o: IOrder) => o.status === activeTab)
            .filter((o: IOrder) => {
                if (!search.trim()) return true;
                const digits = o.orderNumber.replace(/^ORD-/, "");
                return digits.startsWith(search.trim());
            });
    }, [orders, activeTab, search]);


    return (
        <div className="main__container">
            <h1 className={styles.title}>Заказы</h1>

            {/* Поиск */}
            <div className={styles.searchWrapper}>
                <input
                    type="text"
                    placeholder="Поиск по номеру заказа..."
                    className={styles.search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className={`${styles.tabs} mb-10`}>
                {TABS.map((tab) => (
                    <div
                        key={tab.value}
                        className={`${styles.tab} ${activeTab === tab.value ? styles.active : ""}`}
                        onClick={() => {
                            setActiveTab(tab.value);
                        }}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            {/* Таблица */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>№ заказа</th>
                        <th>Покупатель</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                        <th>Дата</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order: IOrder) => (
                            <OrderItem
                                key={order._id}
                                order={order}
                                search={search}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className={styles.empty}>
                                Заказов нет
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};