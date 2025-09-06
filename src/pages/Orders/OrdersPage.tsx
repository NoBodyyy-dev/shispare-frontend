import {useSocket} from "../../context/SocketContext.tsx";
import {useEffect, useState} from "react";
import {IOrder, OrderStatus} from "../../store/interfaces/order.interface.ts";
import {OrderItem} from "./OrderItem.tsx";
import styles from "./orders.module.sass";
import {Modal} from "../../lib/modal/Modal.tsx";

const TABS: {label: string; value: OrderStatus, statusLabel: string}[] = [
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
    const [status, setStatus] = useState("В ожидании");
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);

    useEffect(() => {
        getOrders();
    }, []);

    const filteredOrders = orders
        .filter((o: IOrder) => o.status === activeTab)
        .filter((o: IOrder) => {
            if (!search.trim()) return true;
            const digits = o.orderNumber.replace(/^ORD-/, "");
            return digits.startsWith(search.trim());
        });

    const handleClickItem = (order: IOrder) => {
        setOpenModal(true);
        setSelectedOrder(order);
    }

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
                            setStatus(tab.statusLabel);
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
                                status={status}
                                order={order}
                                search={search}
                                onClick={() => handleClickItem(order)}
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

            {/* Модальное окно */}
            <Modal modal={openModal} setModal={setOpenModal}>
                {selectedOrder && (
                    <div className={styles.orderDetails}>
                        <h2>Заказ {selectedOrder.orderNumber}</h2>
                        <p><b>Покупатель:</b> {selectedOrder.owner.fullName}</p>
                        <p><b>Телефон:</b> {selectedOrder.deliveryInfo.phone}</p>
                        <p><b>Адрес:</b> {selectedOrder.deliveryInfo.address}</p>
                        <p><b>Сумма:</b> {selectedOrder.finalAmount} ₽</p>
                        <p><b>Способ оплаты:</b> {selectedOrder.paymentMethod}</p>
                        <p><b>Статус:</b> {selectedOrder.status}</p>

                        <h3>Товары:</h3>
                        <ul>
                            {selectedOrder.items.map((it, i) => (
                                <li key={i}>
                                    {it.quantity}
                                    {/*{it.product} × {it.quantity} — {it.price} ₽*/}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Modal>
        </div>
    );
};