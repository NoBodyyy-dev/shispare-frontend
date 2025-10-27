import React, { useCallback } from "react";
import { CartProductInterface } from "../../store/interfaces/product.interface";
import { removeFromCart } from "../../store/actions/cart.action";
import { useAppDispatch } from "../../hooks/state.hook";
import { QuantityButtons } from "./QuantityButtons";
import styles from "./product.module.sass";

type Props = {
    item: CartProductInterface;
};

export const CartItem: React.FC<Props> = ({ item }) => {
    const dispatch = useAppDispatch();
    const { product, article } = item;
    const variant = product.variants.find((v) => v.article === article)!;
    const hasDiscount = variant.discount > 0;

    const finalPrice = hasDiscount
        ? variant.price - (variant.price * variant.discount) / 100
        : variant.price;

    const handleRemove = useCallback(() => {
        dispatch(removeFromCart({ productId: product._id, article }));
    }, [dispatch, product._id, article]);

    return (
        <div className={styles.cartItem}>
            <img
                src={product.images[0]}
                alt={product.title}
                className={styles.image}
            />

            <div className="ml-15">
                <h3 className="fz-18">{product.title}</h3>
                <p className="fz-12 color-gray">Артикул: {variant.article}</p>

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

                <QuantityButtons product={product} article={article} />
            </div>
        </div>
    );
};