import {useEffect} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {getOrderByNumberFunc} from "../../store/actions/order.action.ts";
import {OrderCartItem} from "../../lib/order/OrderCartItem.tsx";
import {CartProductInterface} from "../../store/interfaces/product.interface.ts";
import {IOrderItem} from "../../store/interfaces/order.interface.ts";
import {ProductInterface} from "../../store/interfaces/product.interface.ts";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {SEO} from "../../lib/seo/SEO.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import styles from "./fullOrder.module.sass";

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

const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
        'waiting_for_payment': '#f39c12',
        'pending': '#3498db',
        'processing': '#9b59b6',
        'confirmed': '#2ecc71',
        'shipped': '#16a085',
        'delivered': '#27ae60',
        'cancelled': '#e74c3c',
        'refunded': '#95a5a6'
    };
    return colorMap[status] || '#333';
};

const getDeliveryText = (type: string) => {
    const deliveryMap: Record<string, string> = {
        'pickup': 'Самовывоз',
        'krasnodar': 'Доставка по Краснодару',
        'russia': 'Доставка по России'
    };
    return deliveryMap[type] || type;
};

const getPaymentMethodText = (method: string) => {
    const paymentMap: Record<string, string> = {
        'card': 'Банковская карта',
        'cash': 'Наличные при получении',
        'sbp': 'Система быстрых платежей (СБП)',
        'invoice': 'По счету для юридических лиц',
        'pay_in_shop': 'Оплата в магазине'
    };
    return paymentMap[method] || method;
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
    }).format(value);

const convertOrderItemToCartProduct = (item: IOrderItem, index: number): CartProductInterface | null => {
    const product = typeof item.product === 'object' && item.product !== null ? item.product as ProductInterface : null;
    if (!product) return null;

    const article = item.article || (product.variants && product.variants[0]?.article) || 0;

    return {
        _id: `${product._id}-${article}-${index}`,
        product: product,
        article: article,
        quantity: item.quantity,
        addedAt: new Date()
    };
};

export const FullOrderPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {orderNumber} = useParams();
    const {currentOrder, isLoadingOrder, errorOrder} = useAppSelector(state => state.order);

    useEffect(() => {
        if (orderNumber) {
            dispatch(getOrderByNumberFunc(orderNumber));
        }
    }, [orderNumber, dispatch]);

    const handlePayment = () => {
        if (currentOrder?.paymentUrl) {
            window.location.href = currentOrder.paymentUrl;
        }
    };

    if (isLoadingOrder) {
        return (
            <div className="main__container">
                <div className={styles.loader}>Загрузка заказа...</div>
            </div>
        );
    }

    if (errorOrder || !currentOrder) {
        return (
            <div className="main__container">
                <Breadcrumbs items={[
                    {label: 'Главная', path: '/'},
                    {label: 'Заказы', path: '/orders'},
                    {label: 'Заказ не найден', path: ''}
                ]}/>
                <div className={styles.error}>
                    <h1>Заказ не найден</h1>
                    <p>Заказ с номером {orderNumber} не найден или у вас нет доступа к нему.</p>
                    <Link to="/orders" className={styles.backLink}>← Вернуться к списку заказов</Link>
                </div>
            </div>
        );
    }

    const cartProducts = currentOrder.items
        .map((item, index) => convertOrderItemToCartProduct(item, index))
        .filter((item): item is CartProductInterface => item !== null);

    const breadcrumbs = [
        {label: 'Главная', path: '/'},
        {label: 'Заказы', path: '/orders'},
        {label: `Заказ ${currentOrder.orderNumber}`, path: ''}
    ];

    return (
        <div className="main__container">
            <SEO
                title={`Заказ ${currentOrder.orderNumber}`}
                description={`Детальная информация о заказе ${currentOrder.orderNumber}`}
            />
            <Breadcrumbs items={breadcrumbs}/>

            <div className={styles.orderPage}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Заказ {currentOrder.orderNumber}</h1>
                    <div className={styles.statusBadge} style={{backgroundColor: getStatusColor(currentOrder.status)}}>
                        {getStatusText(currentOrder.status)}
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.mainSection}>
                        {/* Товары в заказе */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Товары в заказе</h2>
                            <div className={styles.productsList}>
                                {cartProducts.length > 0 ? (
                                    cartProducts.map((item) => (
                                        <OrderCartItem key={item._id} item={item}/>
                                    ))
                                ) : (
                                    <div className={styles.emptyMessage}>Товары в заказе отсутствуют</div>
                                )}
                            </div>
                        </section>

                        {/* Информация о заказе */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Информация о заказе</h2>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Номер заказа:</span>
                                    <span className={styles.value}>{currentOrder.orderNumber}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Дата создания:</span>
                                    <span className={styles.value}>
                                        {new Date(currentOrder.createdAt).toLocaleString('ru-RU')}
                                    </span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Дата обновления:</span>
                                    <span className={styles.value}>
                                        {new Date(currentOrder.updatedAt).toLocaleString('ru-RU')}
                                    </span>
                                </div>
                                {currentOrder.trackingNumber && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>Трек-номер:</span>
                                        <span className={styles.value}>{currentOrder.trackingNumber}</span>
                                    </div>
                                )}
                                {currentOrder.deliveredAt && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>Дата доставки:</span>
                                        <span className={styles.value}>
                                            {new Date(currentOrder.deliveredAt).toLocaleString('ru-RU')}
                                        </span>
                                    </div>
                                )}
                                {currentOrder.cancelledAt && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>Дата отмены:</span>
                                        <span className={styles.value}>
                                            {new Date(currentOrder.cancelledAt).toLocaleString('ru-RU')}
                                        </span>
                                    </div>
                                )}
                                {currentOrder.canceledCaused && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>Причина отмены:</span>
                                        <span className={styles.value}>{currentOrder.canceledCaused}</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Информация о покупателе */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Информация о покупателе</h2>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>ФИО:</span>
                                    <span className={styles.value}>
                                        {currentOrder.owner?.fullName || currentOrder.owner?.email || "Пользователь удален"}
                                    </span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Email:</span>
                                    <span className={styles.value}>
                                        {currentOrder.owner?.email || "Не указан"}
                                    </span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Телефон:</span>
                                    <span className={styles.value}>{currentOrder.deliveryInfo.phone}</span>
                                </div>
                                {currentOrder.owner?.telegramId && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>Telegram ID:</span>
                                        <span className={styles.value}>{currentOrder.owner.telegramId}</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Информация о доставке */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Информация о доставке</h2>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Способ доставки:</span>
                                    <span className={styles.value}>{getDeliveryText(currentOrder.deliveryType)}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Город:</span>
                                    <span className={styles.value}>{currentOrder.deliveryInfo.city}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Адрес:</span>
                                    <span className={styles.value}>{currentOrder.deliveryInfo.address}</span>
                                </div>
                                {currentOrder.deliveryInfo.postalCode && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>Почтовый индекс:</span>
                                        <span className={styles.value}>{currentOrder.deliveryInfo.postalCode}</span>
                                    </div>
                                )}
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Получатель:</span>
                                    <span className={styles.value}>{currentOrder.deliveryInfo.recipientName}</span>
                                </div>
                                {currentOrder.deliveryInfo.comment && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>Комментарий:</span>
                                        <span className={styles.value}>{currentOrder.deliveryInfo.comment}</span>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className={styles.sidebar}>
                        {/* Оплата */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Оплата</h2>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Способ оплаты:</span>
                                    <span className={styles.value}>{getPaymentMethodText(currentOrder.paymentMethod)}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Статус оплаты:</span>
                                    <span className={styles.value}>
                                        <span className={currentOrder.paymentStatus ? styles.paid : styles.unpaid}>
                                            {currentOrder.paymentStatus ? 'Оплачен' : 'Не оплачен'}
                                        </span>
                                    </span>
                                </div>
                                {!currentOrder.paymentStatus && currentOrder.paymentUrl && (
                                    <div className={styles.paymentButton}>
                                        <Button
                                            onClick={handlePayment}
                                            className={styles.payButton}
                                        >
                                            Перейти к оплате
                                        </Button>
                                    </div>
                                )}
                                {currentOrder.invoiceUrl && (
                                    <div className={styles.infoRow}>
                                        <a href={currentOrder.invoiceUrl} target="_blank" rel="noopener noreferrer" className={styles.documentLink}>
                                            📄 Открыть счет/накладную
                                        </a>
                                    </div>
                                )}
                                {currentOrder.documentUrl && (
                                    <div className={styles.infoRow}>
                                        <a href={currentOrder.documentUrl} target="_blank" rel="noopener noreferrer" className={styles.documentLink}>
                                            📥 Скачать документ
                                        </a>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Итоговая сумма */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Итоговая сумма</h2>
                            <div className={styles.totalInfo}>
                                <div className={styles.totalRow}>
                                    <span className={styles.totalLabel}>Сумма товаров:</span>
                                    <span className={styles.totalValue}>{formatCurrency(currentOrder.totalAmount)}</span>
                                </div>
                                {currentOrder.discountAmount > 0 && (
                                    <div className={styles.totalRow}>
                                        <span className={styles.totalLabel}>Скидка:</span>
                                        <span className={styles.totalValue}>-{formatCurrency(currentOrder.discountAmount)}</span>
                                    </div>
                                )}
                                <div className={styles.totalRow}>
                                    <span className={styles.totalLabel}>Доставка:</span>
                                    <span className={styles.totalValue}>{formatCurrency(currentOrder.deliveryCost)}</span>
                                </div>
                                <div className={styles.totalRow + ' ' + styles.finalTotal}>
                                    <span className={styles.totalLabel}>Итого к оплате:</span>
                                    <span className={styles.totalValue}>{formatCurrency(currentOrder.finalAmount)}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

