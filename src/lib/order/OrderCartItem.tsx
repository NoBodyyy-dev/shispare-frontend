import React from "react";
import {CartProductInterface} from "../../store/interfaces/product.interface";
import {Link} from "react-router-dom";
import styles from "./orderCartItem.module.sass";

type Props = {
    item: CartProductInterface;
};

export const OrderCartItem: React.FC<Props> = ({item}) => {
    const {product, article, quantity} = item;
    const variant = product.variants.find((v) => v.article === article);

    if (!variant) return null;

    const hasDiscount = variant.discount > 0;
    const finalPrice = hasDiscount
        ? variant.price - (variant.price * variant.discount) / 100
        : variant.price;

    const totalPrice = finalPrice * quantity;
    return (
        <Link to={`/catalog/${product.category.slug}/${product.slug}/${variant.article}`}
              >
            <div className={styles.orderCartItem}>
                <img
                    src={product.images?.[0] || '/no-image.svg'}
                    alt={product.title}
                    className={styles.image}
                />

                <div className={styles.content}>
                    <Link to={`/product/${product.slug || product._id}`} className={styles.title}>
                        {product.title}
                    </Link>

                    <div className={styles.variantInfo}>
                        <span className={styles.article}>Артикул: {variant.article}</span>
                        {variant.color && (
                            <span className={styles.color}>
                            <span
                                className={styles.colorDot}
                                style={{backgroundColor: variant.color.hex}}
                            />
                                {variant.color.ru}
                        </span>
                        )}
                        {variant.package && (
                            <span className={styles.package}>
                            {variant.package.count} {variant.package.unit}
                        </span>
                        )}
                    </div>
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
                <div className={styles.quantityBlock}>
                    <div className={styles.quantity}>
                        <span className={styles.quantityLabel}>Количество:</span>
                        <span className={styles.quantityValue}>x{quantity}</span>
                    </div>
                    <div className={styles.totalPrice}>
                        <span className={styles.totalLabel}>Итого:</span>
                        <span className={styles.totalValue}>{totalPrice.toLocaleString()} ₽</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
