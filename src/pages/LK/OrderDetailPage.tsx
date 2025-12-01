import {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {getOrderByNumberFunc} from "../../store/actions/order.action.ts";
import {OrderCartItem} from "../../lib/order/OrderCartItem.tsx";
import {CartProductInterface} from "../../store/interfaces/product.interface.ts";
import {IOrderItem} from "../../store/interfaces/order.interface.ts";
import {ProductInterface} from "../../store/interfaces/product.interface.ts";
import styles from "./orderDetail.module.sass";

const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
        'waiting_for_payment': 'Ожидает оплаты',
        'pending': 'Ожидает подтверждения',
        'processing': 'В обработке',
        'confirmed': 'Подтвержден',
        'shipped': 'Отправлен',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен',
        'refunded': 'Возвращен'
    };
    return statusMap[status] || status;
};

const getPaymentMethodText = (method: string) => {
    const methodMap: Record<string, string> = {
        'card': 'Карта',
        'cash': 'Наличные',
        'sbp': 'СБП',
        'invoice': 'По счету',
        'pay_in_shop': 'В магазине'
    };
    return methodMap[method] || method;
};

const getDeliveryTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
        'pickup': 'Самовывоз',
        'krasnodar': 'Доставка по Краснодару',
        'russia': 'Доставка по России'
    };
    return typeMap[type] || type;
};

const convertOrderItemToCartProduct = (item: IOrderItem): CartProductInterface | null => {
    if (typeof item.product !== 'object' || !item.product) {
        return null;
    }
    
    const product = item.product as ProductInterface;
    const article = item.article || (product.variants && product.variants.length > 0 ? product.variants[0].article : 0);
    
    if (!article) {
        return null;
    }
    
    return {
        _id: `${product._id}-${article}`,
        product: product,
        article: article,
        quantity: item.quantity,
        addedAt: new Date()
    };
};

export const OrderDetailPage = () => {
    const dispatch = useAppDispatch();
    const {orderNumber, id: userId} = useParams();
    const {currentOrder, isLoadingOrder, errorOrder} = useAppSelector(state => state.order);

    useEffect(() => {
        if (orderNumber) {
            dispatch(getOrderByNumberFunc(orderNumber));
        }
    }, [orderNumber, dispatch]);

    if (isLoadingOrder) {
        return (
            <div className={styles.container}>
                <div className={styles.loader}>Загрузка заказа...</div>
            </div>
        );
    }

    if (errorOrder || !currentOrder) {
        return (
            <div className={styles.container}>
                <Link to={`/lk/${userId}/orders`} className={styles.backLink}>← Назад к заказам</Link>
                <div className={styles.error}>Заказ не найден</div>
            </div>
        );
    }

    const cartProducts = currentOrder.items
        .map(convertOrderItemToCartProduct)
        .filter((item): item is CartProductInterface => item !== null);

    return (
        <div className={styles.container}>
            <Link to={`/lk/${userId}/orders`} className={styles.backLink}>← Назад к заказам</Link>
            
            <div className={styles.header}>
                <h1 className={styles.title}>Заказ #{currentOrder.orderNumber}</h1>
                <div className={`${styles.status} ${styles[`status-${currentOrder.status}`]}`}>
                    {getStatusText(currentOrder.status)}
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.mainSection}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Товары</h2>
                        <div className={styles.productsList}>
                            {cartProducts.length > 0 ? (
                                cartProducts.map((cartProduct) => (
                                    <OrderCartItem key={cartProduct._id} item={cartProduct} />
                                ))
                            ) : (
                                <div className={styles.noItems}>Товары не найдены</div>
                            )}
                        </div>
                    </section>
                </div>

                <div className={styles.sidebar}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Информация о заказе</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Дата создания:</span>
                                <span className={styles.infoValue}>
                                    {new Date(currentOrder.createdAt).toLocaleString('ru-RU')}
                                </span>
                            </div>
                            {currentOrder.updatedAt && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Дата обновления:</span>
                                    <span className={styles.infoValue}>
                                        {new Date(currentOrder.updatedAt).toLocaleString('ru-RU')}
                                    </span>
                                </div>
                            )}
                            {currentOrder.deliveredAt && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Дата доставки:</span>
                                    <span className={styles.infoValue}>
                                        {new Date(currentOrder.deliveredAt).toLocaleString('ru-RU')}
                                    </span>
                                </div>
                            )}
                            {currentOrder.cancelledAt && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Дата отмены:</span>
                                    <span className={styles.infoValue}>
                                        {new Date(currentOrder.cancelledAt).toLocaleString('ru-RU')}
                                    </span>
                                </div>
                            )}
                            {currentOrder.canceledCaused && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Причина отмены:</span>
                                    <span className={`${styles.infoValue} ${styles.cancellationReason}`}>
                                        {currentOrder.canceledCaused}
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Доставка</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Тип доставки:</span>
                                <span className={styles.infoValue}>
                                    {getDeliveryTypeText(currentOrder.deliveryType)}
                                </span>
                            </div>
                            {currentOrder.deliveryInfo.recipientName && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Получатель:</span>
                                    <span className={styles.infoValue}>
                                        {currentOrder.deliveryInfo.recipientName}
                                    </span>
                                </div>
                            )}
                            {currentOrder.deliveryInfo.phone && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Телефон:</span>
                                    <span className={styles.infoValue}>
                                        {currentOrder.deliveryInfo.phone}
                                    </span>
                                </div>
                            )}
                            {(currentOrder.deliveryInfo.city || currentOrder.deliveryInfo.address) && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Адрес:</span>
                                    <span className={styles.infoValue}>
                                        {currentOrder.deliveryInfo.city || ''}
                                        {currentOrder.deliveryInfo.city && currentOrder.deliveryInfo.address ? ', ' : ''}
                                        {currentOrder.deliveryInfo.address || ''}
                                    </span>
                                </div>
                            )}
                            {currentOrder.deliveryInfo.postalCode && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Индекс:</span>
                                    <span className={styles.infoValue}>
                                        {currentOrder.deliveryInfo.postalCode}
                                    </span>
                                </div>
                            )}
                            {currentOrder.deliveryInfo.comment && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Комментарий:</span>
                                    <span className={styles.infoValue}>
                                        {currentOrder.deliveryInfo.comment}
                                    </span>
                                </div>
                            )}
                            {currentOrder.trackingNumber && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Трек-номер:</span>
                                    <span className={styles.infoValue}>
                                        {currentOrder.trackingNumber}
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Оплата</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Способ оплаты:</span>
                                <span className={styles.infoValue}>
                                    {getPaymentMethodText(currentOrder.paymentMethod)}
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Статус оплаты:</span>
                                <span className={`${styles.infoValue} ${currentOrder.paymentStatus ? styles.paid : styles.unpaid}`}>
                                    {currentOrder.paymentStatus ? 'Оплачено' : 'Не оплачено'}
                                </span>
                            </div>
                            {currentOrder.invoiceUrl && (
                                <div className={styles.infoRow}>
                                    <a href={currentOrder.invoiceUrl} target="_blank" rel="noreferrer" className={styles.link}>
                                        Счет / документ
                                    </a>
                                </div>
                            )}
                            {currentOrder.documentUrl && (
                                <div className={styles.infoRow}>
                                    <a href={currentOrder.documentUrl} target="_blank" rel="noreferrer" className={styles.link}>
                                        Скачать документ
                                    </a>
                                </div>
                            )}
                            {currentOrder.paymentUrl && !currentOrder.paymentStatus && (
                                <div className={styles.infoRow}>
                                    <a href={currentOrder.paymentUrl} target="_blank" rel="noreferrer" className={styles.paymentLink}>
                                        Перейти к оплате
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Итоги</h2>
                        <div className={styles.summary}>
                            {currentOrder.totalAmount && (
                                <div className={styles.summaryRow}>
                                    <span>Сумма товаров:</span>
                                    <span>{currentOrder.totalAmount.toFixed(2)} ₽</span>
                                </div>
                            )}
                            {currentOrder.discountAmount > 0 && (
                                <div className={styles.summaryRow}>
                                    <span>Скидка:</span>
                                    <span className={styles.discount}>-{currentOrder.discountAmount.toFixed(2)} ₽</span>
                                </div>
                            )}
                            {currentOrder.deliveryCost !== undefined && currentOrder.deliveryCost > 0 && (
                                <div className={styles.summaryRow}>
                                    <span>Доставка:</span>
                                    <span>{currentOrder.deliveryCost.toFixed(2)} ₽</span>
                                </div>
                            )}
                            <div className={`${styles.summaryRow} ${styles.total}`}>
                                <span>Итого:</span>
                                <span>{currentOrder.finalAmount.toFixed(2)} ₽</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

