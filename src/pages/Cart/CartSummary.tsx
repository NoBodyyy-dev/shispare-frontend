import {useState, FC} from "react";
import styles from "./cart.module.sass";
import {Button} from "../../lib/buttons/Button.tsx";
import {useAppSelector} from "../../hooks/state.hook.ts";
import {useNavigate} from "react-router-dom";

type Props = {
    isRedirect: boolean;
}

export const CartSummary: FC<Props> = (props: Props) => {
    const {discountAmount, finalAmount, totalAmount, totalProducts} = useAppSelector((state) => state.cart);
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/cart/checkout")
    }

    const handleCreateOrder = () => {

    }

    const finallyHandler = props.isRedirect ? handleRedirect : handleCreateOrder

    const buttonText = props.isRedirect ? "Перейти к оформлению" : "Заказать"

    return (
        <div className={styles.summary}>
            <div>
                <div className={styles.summaryRow}>
                    <span className={`${styles.summaryLabel} pr-4 fz-14`}>Цена товаров ({totalProducts} шт.)</span>
                    <span className={styles.dots}></span>
                    <span className={styles.summaryValue}>{totalAmount.toLocaleString()} ₽</span>
                </div>
                <div className={`${styles.summaryRow} mb-30`}>
                    <span className={`${styles.summaryLabel} pr-4 fz-14`}>Скидка</span>
                    <span className={styles.dots}></span>
                    <span className={styles.summaryValue}>-{discountAmount.toLocaleString()} ₽</span>
                </div>
                <div className={`${styles.summaryRow}`}>
                    <span className={`${styles.summaryLabel} fz-24`}>Итого</span>
                    <span className={styles.dots}></span>
                    <span className={`${styles.summaryValue} fz-24`}>{finalAmount.toLocaleString()} ₽</span>
                </div>
            </div>

            <Button onClick={finallyHandler} className="full-width">
                {buttonText}
            </Button>
        </div>
    );
};