import React, {useState} from 'react';
import {IOrder} from '../../store/interfaces/order.interface';
import styles from './order.module.sass';
import {Modal} from '../modal/Modal';

type Props = {
    order: IOrder;
}

export const OrderCard: React.FC<Props> = ({order}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className={styles.orderCard} onClick={() => setOpen(true)} role="button" tabIndex={0}>
                <div className={styles.rowTop}>
                    <div className={styles.id}>#{order.orderNumber || order._id}</div>
                    <div className={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>

                <div className={styles.rowBottom}>
                    <div className={styles.amount}>{order.finalAmount} ₽</div>
                    <div className={`${styles.status} ${styles[`status-${order.status}`]}`}>{order.status}</div>
                </div>
            </div>

            <Modal modal={open} setModal={setOpen}>
                <div className={styles.details}>
                    <h3>Заказ #{order.orderNumber || order._id}</h3>
                    <div className={styles.meta}>
                        <div>Дата: {new Date(order.createdAt).toLocaleString()}</div>
                        <div>Статус: <strong>{order.status}</strong></div>
                        <div>Итого: <strong>{order.finalAmount} ₽</strong></div>
                    </div>

                    <h4>Товары</h4>
                    <div className={styles.items}>
                        {order.items.map((it, idx) => (
                            <div key={idx} className={styles.itemRow}>
                                <div className={styles.itemName}>{it.product}</div>
                                <div className={styles.itemQty}>x{it.quantity}</div>
                                <div className={styles.itemPrice}>{it.price} ₽</div>
                            </div>
                        ))}
                    </div>

                    <h4>Доставка</h4>
                    <div className={styles.delivery}>
                        <div>{order.deliveryInfo.recipientName}</div>
                        <div>{order.deliveryInfo.phone}</div>
                        <div>{order.deliveryInfo.city}, {order.deliveryInfo.address}</div>
                        {order.deliveryInfo.postalCode && <div>Индекс: {order.deliveryInfo.postalCode}</div>}
                        {order.deliveryInfo.comment && <div>Комментарий: {order.deliveryInfo.comment}</div>}
                    </div>

                    <h4>Оплата</h4>
                    <div className={styles.payment}>
                        <div>Метод: {order.paymentMethod}</div>
                        <div>Статус оплаты: {order.paymentStatus ? 'Оплачено' : 'Не оплачено'}</div>
                        {order.invoiceUrl && <div><a href={order.invoiceUrl} target="_blank" rel="noreferrer">Счет / документ</a></div>}
                        {order.trackingNumber && <div>Трек-номер: {order.trackingNumber}</div>}
                    </div>

                    <div className={styles.actions}>
                        <button className="btn primary" onClick={() => setOpen(false)}>Закрыть</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default OrderCard;
