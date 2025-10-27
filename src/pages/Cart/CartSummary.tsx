import {FC} from "react";
import styles from "./cart.module.sass";
import {Button} from "../../lib/buttons/Button.tsx";
import {useAppSelector, useAppDispatch} from "../../hooks/state.hook.ts";
import {useNavigate} from "react-router-dom";
import {createOrderFunc} from "../../store/actions/order.action.ts";
import {CheckoutForm} from "./CheckoutPage.tsx";
import {FieldErrors} from "react-hook-form";

type Props = {
    isRedirect: boolean;
    formData?: CheckoutForm;
    formErrors?: FieldErrors<CheckoutForm>;
    isFormValid?: boolean;
    isSubmitting?: boolean;
    onSubmit?: () => void;
}

export const CartSummary: FC<Props> = ({
                                           isRedirect,
                                           formData,
                                           formErrors,
                                           isFormValid = true,
                                           isSubmitting = false,
                                           onSubmit
                                       }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {discountAmount, finalAmount, totalAmount, totalProducts, products} = useAppSelector((state) => state.cart);

    const handleRedirect = () => {
        navigate("/cart/checkout");
    };

    const handleCreateOrder = async () => {
        if (!isFormValid || !formData || !onSubmit) return;

        try {
            if (!formData.phone) {
                console.error("Телефон обязателен");
                return;
            }

            if (formData.deliveryKind !== "pickup" && !formData.address) {
                console.error("Адрес обязателен для доставки");
                return;
            }

            if (!formData.paymentMethod) {
                console.error("Способ оплаты обязателен");
                return;
            }

            onSubmit();

            const result = await dispatch(createOrderFunc(formData)).unwrap();

            if (result.success) {
                localStorage.removeItem("checkout_form_data");
                navigate("/order-success", {
                    state: {orderId: result.orderId, totalAmount: finalAmount}
                });
            }
        } catch (error) {
            console.error("Ошибка создания заказа:", error);
        }
    };

    const handleButtonClick = isRedirect ? handleRedirect : handleCreateOrder;
    const buttonText = isRedirect ? "Перейти к оформлению" : "Заказать";

    // Проверяем есть ли товары в корзине
    const isCartEmpty = products.length === 0;

    // Проверяем ошибки формы для отображения подсказок
    const hasFormErrors = formErrors && Object.keys(formErrors).length > 0;

    return (
        <div className={styles.summary}>
            <div>
                <div className={styles.summaryRow}>
                    <span className={`${styles.summaryLabel} pr-4 fz-14`}>
                        Цена товаров ({totalProducts} шт.)
                    </span>
                    <span className={styles.dots}></span>
                    <span className={styles.summaryValue}>{totalAmount.toLocaleString()} ₽</span>
                </div>

                {discountAmount > 0 && (
                    <div className={`${styles.summaryRow} mb-30`}>
                        <span className={`${styles.summaryLabel} pr-4 fz-14`}>Скидка</span>
                        <span className={styles.dots}></span>
                        <span className={styles.summaryValue}>-{discountAmount.toLocaleString()} ₽</span>
                    </div>
                )}

                <div className={`${styles.summaryRow}`}>
                    <span className={`${styles.summaryLabel} fz-24`}>Итого</span>
                    <span className={styles.dots}></span>
                    <span className={`${styles.summaryValue} fz-24`}>{finalAmount.toLocaleString()} ₽</span>
                </div>

                {/* Подсказки об ошибках формы */}
                {hasFormErrors && !isRedirect && (
                    <div className={styles.formErrors}>
                        <p className={styles.errorText}>Заполните все обязательные поля:</p>
                        {formErrors.phone && <span className={styles.errorItem}>• Телефон</span>}
                        {formErrors.fullName && <span className={styles.errorItem}>• ФИО получателя</span>}
                        {formErrors.address && <span className={styles.errorItem}>• Адрес</span>}
                        {formErrors.paymentMethod && <span className={styles.errorItem}>• Способ оплаты</span>}
                    </div>
                )}
            </div>

            <Button
                onClick={handleButtonClick}
                className="full-width"
                disabled={(!isRedirect && (!isFormValid || isCartEmpty || isSubmitting))}
            >
                {isSubmitting ? "Обработка..." : buttonText}
            </Button>

            {!isRedirect && isCartEmpty && (
                <p className={styles.emptyCart}>Корзина пуста</p>
            )}
        </div>
    );
};