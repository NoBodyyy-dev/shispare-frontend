import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import React, {useEffect} from "react";
import styles from "./lk.module.sass"
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
                <div className={styles.ordersGrid}>
                    <div className={styles.orderHeader}>ID заказа</div>
                    <div className={styles.orderHeader}>Дата</div>
                    <div className={styles.orderHeader}>Сумма</div>
                    <div className={styles.orderHeader}>Статус</div>

                    {orders.map(order => (
                        <React.Fragment key={order._id}>
                            <div>{order._id}</div>
                            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                            <div>{order.finalAmount} ₽</div>
                            <div className={styles[`status-${order.status}`]}>
                                {order.status}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                <p className={styles.noOrders}>Заказы не найдены</p>
            )}
        </section>
    );
};