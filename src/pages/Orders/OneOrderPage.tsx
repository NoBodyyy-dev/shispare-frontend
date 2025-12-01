import {useEffect} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {getOrderByNumberFunc} from "../../store/actions/order.action.ts";
import {OrderDetails} from "../../lib/order/OrderDetails.tsx";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {SEO} from "../../lib/seo/SEO.tsx";
import styles from "./orders.module.sass";

export const OneOrderPage = () => {
    const dispatch = useAppDispatch();
    const {currentOrder, isLoadingOrder, errorOrder} = useAppSelector(state => state.order);
    const {orderNumber} = useParams();

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
        return <p>Загрузка...</p>
    }

    if (errorOrder || !currentOrder) {
        return (
            <div className="main__container p-20">
                <Breadcrumbs items={[
                    {label: 'Главная', path: '/'},
                    {label: 'Заказы', path: '/orders'},
                    {label: 'Заказ не найден', path: ''}
                ]} isLoading={false}/>
                <SEO
                    title="Заказ не найден"
                    description="Заказ не найден или у вас нет доступа к нему"
                    noindex={true}
                />
                <div className={styles.error}>
                    <h1>Заказ не найден</h1>
                    <p>Заказ с номером {orderNumber} не найден или у вас нет доступа к нему.</p>
                    <Link to="/orders" className={styles.backLink}>← Вернуться к списку заказов</Link>
                </div>
            </div>
        );
    }

    const breadcrumbs = [
        {label: 'Главная', path: '/'},
        {label: 'Заказы', path: '/orders'},
        {label: `Заказ ${currentOrder.orderNumber}`, path: ''}
    ];

    return (
        <div className="main__container p-20">
            <SEO
                title={`Заказ ${currentOrder.orderNumber}`}
                description={`Детальная информация о заказе ${currentOrder.orderNumber}`}
            />
            <Breadcrumbs items={breadcrumbs} isLoading={false}/>
            <OrderDetails order={currentOrder} handlePayment={handlePayment}/>
        </div>
    );
};
