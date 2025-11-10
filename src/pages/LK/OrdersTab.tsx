import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {useEffect} from "react";
import styles from "./lk.module.sass"
import {OrderCard} from '../../lib/order/OrderCard';
import {getUserOrdersFunc} from "../../store/actions/order.action.ts";
import {useParams} from "react-router-dom";

export const OrdersTab = () => {
    const dispatch = useAppDispatch();
    const {orders} = useAppSelector(state => state.order);
    const {id: paramsId} = useParams();

    useEffect(() => {
        if (!orders.length) {
            dispatch(getUserOrdersFunc({userId: paramsId!}));
            console.log("Hahahahh")
        }
    }, [orders.length]);

    return (
        <section className={styles.ordersSection}>
            <h1 className="title">История заказов</h1>
            {orders?.length ? (
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