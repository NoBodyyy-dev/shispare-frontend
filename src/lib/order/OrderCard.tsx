import React from 'react';
import {IOrder} from '../../store/interfaces/order.interface';
import styles from './order.module.sass';
import {Link, useParams} from 'react-router-dom';

type Props = {
    order: IOrder;
}

export const OrderCard: React.FC<Props> = ({order}) => {
    const {id: userId} = useParams();
    
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

    return (
        <Link 
            to={`/lk/${userId}/orders/${order.orderNumber}`}
            className={styles.orderCard}
        >
            <div className={styles.rowTop}>
                <div className={styles.id}>#{order.orderNumber || order._id}</div>
                <div className={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
            <div className={styles.rowBottom}>
                <div className={styles.amount}>{order.finalAmount.toFixed(2)} ₽</div>
                <div className={`${styles.status} ${styles[`status-${order.status}`]}`}>
                    {getStatusText(order.status)}
                </div>
            </div>
        </Link>
    )
}

export default OrderCard;
