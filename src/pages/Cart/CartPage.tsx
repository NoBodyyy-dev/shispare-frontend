import {ProductInterface} from "../../store/interfaces/product.interface";
import ProductInCart from "../../lib/products/ProductInCart";
import styles from "./cart.module.sass"
import Button from "../../lib/buttons/Button.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {addMessage} from "../../store/slices/push.slice.ts";


export default function Cart() {
    const dispatch = useAppDispatch();
    const {discount, priceWithDiscount, totalPrice, totalProducts, cart} = useAppSelector(state => state.cart);

    const discountInformation = () => {
        if (totalPrice === priceWithDiscount)
            return <>
                <p className="mb-20 fz-24">Итого:<span>{priceWithDiscount}</span></p>
            </>
        return <>
            <p className="mb-20 fz-24">Итого: <span>{priceWithDiscount} руб.</span></p>
            <p className="fz-20">Скидка: <span className="font-roboto">{discount} руб.</span></p>
        </>
    }

    return (
        <>
            <div className="main__container cart">
                <h1 className="title mb-25">Корзина</h1>
                <div className={styles.containerGrid}>
                    <div className={``}>
                        {Object.values(cart as Record<string, {product: ProductInterface, count: number }>).map((data: {product: ProductInterface, count: number }) => {
                            return <ProductInCart key={data.product._id} productData={data.product} count={data.count}/>;
                        })}
                    </div>
                    <div className={`${styles.block} p-20`}>
                        <div className="mb-20">
                            {discountInformation()}
                            <p className="fz-20">Количество товаров: <span className="font-roboto">{totalProducts}</span></p>
                        </div>
                        <Button className="full-width" onClick={() => dispatch(addMessage("Вы не авторизованы"))}>Оформить
                            заказ</Button>
                    </div>
                </div>
                <div className="cart__block"></div>
            </div>
        </>
    );
}
