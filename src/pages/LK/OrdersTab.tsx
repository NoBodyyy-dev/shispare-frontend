import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {useEffect} from "react";
import styles from "./lk.module.sass"
import {OrderCard} from '../../lib/order/OrderCard';
import {getUserOrdersFunc} from "../../store/actions/order.action.ts";
import {useParams} from "react-router-dom";

export const OrdersTab = () => {
    const dispatch = useAppDispatch();
    const {orders, isLoadingOrders} = useAppSelector(state => state.order);
    const {id: paramsId} = useParams();

    useEffect(() => {
        if (paramsId) {
            dispatch(getUserOrdersFunc({userId: paramsId}));
        }
    }, [paramsId]);

    if (isLoadingOrders) {
        return (
            <section className={styles.ordersSection}>
                <div className={styles.loader}>Загрузка заказов...</div>
            </section>
        );
    }

    return (
        <section className={styles.ordersSection}>
            <h1 className="title">История заказов</h1>
            {orders && orders.length > 0 ? (
                <div className={styles.ordersGridCards}>
                    {orders.map(order => (
                        <OrderCard key={order._id} order={order} />
                    ))}
                </div>
            ) : (
                <p className={styles.noOrders}>Заказы не найдены</p>
            )}
        </section>
    );
};