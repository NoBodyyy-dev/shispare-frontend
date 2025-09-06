import {useEffect, useMemo} from "react";
import {Link, useParams} from "react-router-dom";
import {useSocket} from "../../context/SocketContext.tsx";
import {
    DeliveryType,
    IOrder,
    OrderStatus,
    PaymentMethod,
} from "../../store/interfaces/order.interface.ts";
import styles from "./orders.module.sass";

const STATUS_LABEL: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "В ожидании",
    [OrderStatus.PROCESSING]: "В обработке",
    [OrderStatus.CONFIRMED]: "Подтвержден",
    [OrderStatus.SHIPPED]: "Отправлен",
    [OrderStatus.DELIVERED]: "Доставлен",
    [OrderStatus.CANCELLED]: "Отменен",
    [OrderStatus.REFUNDED]: "Возвращен",
};

const DELIVERY_LABEL: Record<DeliveryType, string> = {
    [DeliveryType.PICKUP]: "Самовывоз",
    [DeliveryType.KRASNODAR]: "Доставка по Краснодару",
    [DeliveryType.RUSSIA]: "Доставка по России",
};

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
    [PaymentMethod.CARD]: "Картой",
    [PaymentMethod.CASH]: "Наличные",
    [PaymentMethod.SBP]: "СБП",
    [PaymentMethod.INVOICE]: "По счету",
    [PaymentMethod.PAYINSHOP]: "Оплата в магазине",
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
    }).format(value);

export const OneOrderPage = () => {
    const {orders, getOrders} = useSocket();
    const {orderId} = useParams();

    useEffect(() => {
        if (!orders || orders.length === 0) getOrders();
    }, []);

    const order: IOrder | undefined = useMemo(() => {
        if (!orderId) return undefined;
        const byId = orders.find((o: IOrder) => o._id === orderId);
        if (byId) return byId;
        if (orderId.startsWith("ORD-")) {
            return orders.find((o: IOrder) => o.orderNumber === orderId);
        }
        return undefined;
    }, [orders, orderId]);

    if (!order) {
        return (
            <div className="main__container">
                <div className="mb-10">
                    <Link to="/orders">← Назад к списку заказов</Link>
                </div>
                <h1 className={styles.title}>Заказ</h1>
                <p>Загрузка или заказ не найден.</p>
            </div>
        );
    }

    return (
        <div className="main__container">
            <div className="mb-10">
                <Link to="/orders">← Назад к списку заказов</Link>
            </div>

            <h1 className={styles.title}>Заказ {order.orderNumber}</h1>

            <div className={styles.orderDetails}>
                <section className="mb-10">
                    <h2>Информация</h2>
                    <p><b>Статус:</b> {STATUS_LABEL[order.status]}</p>
                    <p><b>Создан:</b> {new Date(order.createdAt).toLocaleString()}</p>
                    <p><b>Обновлен:</b> {new Date(order.updatedAt).toLocaleString()}</p>
                    {order.trackingNumber && (
                        <p><b>Трек-номер:</b> {order.trackingNumber}</p>
                    )}
                </section>

                <section className="mb-10">
                    <h2>Покупатель</h2>
                    <p><b>ФИО:</b> {order.owner.fullName}</p>
                    <p><b>Телефон:</b> {order.deliveryInfo.phone}</p>
                </section>

                <section className="mb-10">
                    <h2>Доставка</h2>
                    <p><b>Тип:</b> {DELIVERY_LABEL[order.deliveryType]}</p>
                    <p><b>Город:</b> {order.deliveryInfo.city}</p>
                    <p><b>Адрес:</b> {order.deliveryInfo.address}</p>
                    {order.deliveryInfo.postalCode && (
                        <p><b>Индекс:</b> {order.deliveryInfo.postalCode}</p>
                    )}
                    {order.deliveryInfo.comment && (
                        <p><b>Комментарий:</b> {order.deliveryInfo.comment}</p>
                    )}
                </section>

                <section className="mb-10">
                    <h2>Оплата</h2>
                    <p><b>Способ:</b> {PAYMENT_LABEL[order.paymentMethod]}</p>
                    <p><b>Статус оплаты:</b> {order.paymentStatus ? "Оплачен" : "Не оплачен"}</p>
                    {order.invoiceUrl && (
                        <p>
                            <a href={order.invoiceUrl} target="_blank" rel="noreferrer">Открыть счет/накладную</a>
                        </p>
                    )}
                    {order.documentUrl && (
                        <p>
                            <a href={order.documentUrl} target="_blank" rel="noreferrer">Скачать документ</a>
                        </p>
                    )}
                </section>

                <section className="mb-10">
                    <h2>Состав заказа</h2>
                    <ul>
                        {order.items.map((it, i) => (
                            <li key={i}>
                                {it.product} × {it.quantity} — {formatCurrency(it.price)}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-10">
                    <h2>Итоги</h2>
                    <p><b>Сумма товаров:</b> {formatCurrency(order.totalAmount)}</p>
                    <p><b>Скидка:</b> {formatCurrency(order.discountAmount)}</p>
                    <p><b>Доставка:</b> {formatCurrency(order.deliveryCost)}</p>
                    <p><b>Итого:</b> {formatCurrency(order.finalAmount)}</p>
                </section>
            </div>
        </div>
    );
};

export default OneOrderPage;
