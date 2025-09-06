import React, {useCallback} from "react";
import styles from "./product.module.sass";
import {CartProductInterface} from "../../store/interfaces/product.interface.ts";
import {removeFromCart} from "../../store/actions/cart.action.ts";
import {removeItemLocal} from "../../store/slices/cart.slice.ts";
import {useAppDispatch} from "../../hooks/state.hook.ts";
import {QuantityButtons} from "./QuantityButtons.tsx";

type Props = {
    item: CartProductInterface;
};

export const CartItem: React.FC<Props> = ({ item }) => {
    const dispatch = useAppDispatch();
    const { product } = item;
    const variant = product.variants[product.variantIndex];
    const hasDiscount = variant.discount > 0;

    const finalPrice = hasDiscount
        ? variant.price - (variant.price * variant.discount) / 100
        : variant.price;

    const handleRemove = useCallback(() => {
        dispatch(removeItemLocal({ productId: product._id, optionIndex: product.variantIndex }));
        dispatch(removeFromCart({ productId: product._id }));
    }, [dispatch, product._id, product.variantIndex]);

    return (
        <div className={styles.cartItem}>
            <img
                src={product.images[0]}
                alt={product.title}
                className={styles.image}
            />

            <div className={styles.info}>
                <h3 className={styles.title}>{product.title}</h3>
                <p className={styles.code}>Артикул: {variant.article}</p>

                <div className={styles.priceBlock}>
                    {hasDiscount && (
                        <span className={styles.discount}>-{variant.discount}%</span>
                    )}
                    {hasDiscount ? (
                        <>
                            <span className={styles.oldPrice}>
                                {variant.price.toLocaleString()} ₽
                            </span>
                            <span className={styles.newPrice}>
                                {finalPrice.toLocaleString()} ₽
                            </span>
                        </>
                    ) : (
                        <span className={styles.newPrice}>
                            {variant.price.toLocaleString()} ₽
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.actions}>
                <button onClick={handleRemove} className={styles.remove}>
                    🗑
                </button>

                <QuantityButtons productId={product._id} />
            </div>
        </div>
    );
};
