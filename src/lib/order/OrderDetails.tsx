import React from "react";
import {IOrder, IOrderItem, OrderStatus, DeliveryType, PaymentMethod} from "../../store/interfaces/order.interface.ts";
import {ProductInterface} from "../../store/interfaces/product.interface.ts";
import styles from "./orderDetails.module.sass";
import {Link} from "react-router-dom";

const STATUS_LABEL: Record<OrderStatus, string> = {
    [OrderStatus.WAITING_FOR_PAYMENT]: "Ожидает оплаты",
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
        maximumFractionDigits: 2,
    }).format(value);

interface OrderDetailsProps {
    order: IOrder;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({order}) => {
    const getStatusClass = (status: OrderStatus) => {
        const statusClasses: Record<OrderStatus, string> = {
            [OrderStatus.WAITING_FOR_PAYMENT]: styles.statusWaiting,
            [OrderStatus.PENDING]: styles.statusPending,
            [OrderStatus.PROCESSING]: styles.statusProcessing,
            [OrderStatus.CONFIRMED]: styles.statusConfirmed,
            [OrderStatus.SHIPPED]: styles.statusShipped,
            [OrderStatus.DELIVERED]: styles.statusDelivered,
            [OrderStatus.CANCELLED]: styles.statusCancelled,
            [OrderStatus.REFUNDED]: styles.statusRefunded,
        };
        return statusClasses[status] || "";
    };

    return (
        <div className={styles.orderDetails}>
            <div className={styles.header}>
                <h1 className={styles.title}>Заказ #{order.orderNumber}</h1>
                <div className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                    {STATUS_LABEL[order.status]}
                </div>
            </div>

            <div className={styles.grid}>
                {/* Информация о заказе */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Информация о заказе</h2>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Номер заказа:</span>
                            <span className={styles.value}>#{order.orderNumber}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Дата создания:</span>
                            <span className={styles.value}>
                                {new Date(order.createdAt).toLocaleString('ru-RU')}
                            </span>
                        </div>
                        {order.updatedAt && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Дата обновления:</span>
                                <span className={styles.value}>
                                    {new Date(order.updatedAt).toLocaleString('ru-RU')}
                                </span>
                            </div>
                        )}
                        {order.deliveredAt && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Дата доставки:</span>
                                <span className={styles.value}>
                                    {new Date(order.deliveredAt).toLocaleString('ru-RU')}
                                </span>
                            </div>
                        )}
                        {order.cancelledAt && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Дата отмены:</span>
                                <span className={styles.value}>
                                    {new Date(order.cancelledAt).toLocaleString('ru-RU')}
                                </span>
                            </div>
                        )}
                        {order.trackingNumber && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Трек-номер:</span>
                                <span className={styles.value}>{order.trackingNumber}</span>
                            </div>
                        )}
                        {order.canceledCaused && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Причина отмены:</span>
                                <span className={`${styles.value} ${styles.cancellationReason}`}>
                                    {order.canceledCaused}
                                </span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Покупатель */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Покупатель</h2>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>ФИО:</span>
                            <span className={styles.value}>{order.owner.fullName}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Email:</span>
                            <span className={styles.value}>{order.owner.email}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Телефон:</span>
                            <span className={styles.value}>{order.deliveryInfo.phone}</span>
                        </div>
                        {order.owner.telegramId && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Telegram ID:</span>
                                <span className={styles.value}>{order.owner.telegramId}</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Доставка */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Доставка</h2>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Тип доставки:</span>
                            <span className={styles.value}>{DELIVERY_LABEL[order.deliveryType]}</span>
                        </div>
                        {order.deliveryInfo.city && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Город:</span>
                                <span className={styles.value}>{order.deliveryInfo.city}</span>
                            </div>
                        )}
                        {order.deliveryInfo.address && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Адрес:</span>
                                <span className={styles.value}>{order.deliveryInfo.address}</span>
                            </div>
                        )}
                        {order.deliveryInfo.postalCode && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Индекс:</span>
                                <span className={styles.value}>{order.deliveryInfo.postalCode}</span>
                            </div>
                        )}
                        {order.deliveryInfo.comment && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Комментарий:</span>
                                <span className={styles.value}>{order.deliveryInfo.comment}</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Оплата */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Оплата</h2>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Способ оплаты:</span>
                            <span className={styles.value}>{PAYMENT_LABEL[order.paymentMethod]}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Статус оплаты:</span>
                            <span className={`${styles.value} ${order.paymentStatus ? styles.paid : styles.unpaid}`}>
                                {order.paymentStatus ? "Оплачено" : "Не оплачено"}
                            </span>
                        </div>
                        {order.invoiceUrl && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Счет/накладная:</span>
                                <a href={order.invoiceUrl} target="_blank" rel="noreferrer" className={styles.link}>
                                    Открыть
                                </a>
                            </div>
                        )}
                        {order.documentUrl && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Документ:</span>
                                <a href={order.documentUrl} target="_blank" rel="noreferrer" className={styles.link}>
                                    Скачать
                                </a>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Состав заказа */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Состав заказа</h2>
                <div className={styles.itemsList}>
                    {order.items.map((item: IOrderItem, index: number) => {
                        const product = typeof item.product === 'object' ? item.product as ProductInterface : null;
                        const variant = product?.variants.find(v => v.article === item.article);

                        if (!product) {
                            return (
                                <div key={index} className={styles.itemCard}>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemName}>Товар удален</span>
                                        <span className={styles.itemArticle}>Артикул: {item.article}</span>
                                    </div>
                                    <div className={styles.itemQuantity}>x{item.quantity}</div>
                                    {item.price && (
                                        <div className={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</div>
                                    )}
                                </div>
                            );
                        }

                        const itemPrice = variant?.price || item.price || 0;
                        const discount = variant?.discount || item.discount || 0;
                        const finalPrice = itemPrice * (1 - discount / 100);

                        return (
                            <div key={index} className={styles.itemCard}>
                                <Link to={`/categories/${product.category?.slug}/${item.article}`} className={styles.itemImageLink}>
                                    <img
                                        src={product.images?.[0] || "/no-image.svg"}
                                        alt={product.title}
                                        className={styles.itemImage}
                                    />
                                </Link>
                                <div className={styles.itemDetails}>
                                    <Link to={`/categories/${product.category?.slug}/${item.article}`} className={styles.itemName}>
                                        {product.title}
                                    </Link>
                                    <div className={styles.itemMeta}>
                                        {variant?.color && (
                                            <span className={styles.itemBadge}>
                                                <span
                                                    className={styles.colorDot}
                                                    style={{backgroundColor: variant.color.hex}}
                                                />
                                                {variant.color.ru}
                                            </span>
                                        )}
                                        {variant?.package && (
                                            <span className={styles.itemBadge}>
                                                {variant.package.count} {variant.package.unit}
                                            </span>
                                        )}
                                        <span className={styles.itemBadge}>Арт: {item.article}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className={styles.itemDiscount}>
                                            Скидка: {discount}%
                                        </div>
                                    )}
                                </div>
                                <div className={styles.itemQuantity}>x{item.quantity}</div>
                                <div className={styles.itemPrice}>
                                    {formatCurrency(finalPrice * item.quantity)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Итоги */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Итоги</h2>
                <div className={styles.summary}>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Сумма товаров:</span>
                        <span className={styles.summaryValue}>{formatCurrency(order.totalAmount)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Скидка:</span>
                            <span className={`${styles.summaryValue} ${styles.discount}`}>
                                -{formatCurrency(order.discountAmount)}
                            </span>
                        </div>
                    )}
                    {order.deliveryCost > 0 && (
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Доставка:</span>
                            <span className={styles.summaryValue}>{formatCurrency(order.deliveryCost)}</span>
                        </div>
                    )}
                    <div className={`${styles.summaryRow} ${styles.total}`}>
                        <span className={styles.summaryLabel}>Итого:</span>
                        <span className={styles.summaryValue}>{formatCurrency(order.finalAmount)}</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

