import {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {getOneOrderFunc} from "../../store/actions/order.action.ts";
import {OrderDetails} from "../../lib/order/OrderDetails.tsx";
import styles from "./orders.module.sass";

export const OneOrderPage = () => {
    const dispatch = useAppDispatch();
    const {currentOrder, isLoadingOrder, errorOrder} = useAppSelector(state => state.order);
    const {orderNumber} = useParams();

    useEffect(() => {
        if (orderNumber) dispatch(getOneOrderFunc({orderNumber}));
    }, [orderNumber, dispatch]);

    if (isLoadingOrder) {
        return (
            <div className="main__container">
                <div className="mb-10">
                    <Link to="/orders">← Назад к списку заказов</Link>
                </div>
                <div className={styles.loader}>Загрузка заказа...</div>
            </div>
        );
    }

    if (errorOrder) {
        return (
            <div className="main__container">
                <div className="mb-10">
                    <Link to="/orders">← Назад к списку заказов</Link>
                </div>
                <div className={styles.error}>Ошибка: {errorOrder}</div>
            </div>
        );
    }

    if (!currentOrder) {
        return (
            <div className="main__container">
                <div className="mb-10">
                    <Link to="/orders">← Назад к списку заказов</Link>
                </div>
                <h1 className={styles.title}>Заказ</h1>
                <p>Заказ не найден.</p>
            </div>
        );
    }

    return (
        <div className="main__container">
            <div className="mb-10">
                <Link to="/orders">← Назад к списку заказов</Link>
            </div>
            <OrderDetails order={currentOrder}/>
        </div>
    );
};

