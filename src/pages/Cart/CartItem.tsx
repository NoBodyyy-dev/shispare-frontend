import {FC} from "react";
import {ProductInterface} from "../../store/interfaces/product.interface";
import styles from "./Cart.module.sass";
import {Button} from "../../lib/buttons/Button.tsx";

type Props = {
    product: ProductInterface;
    count: number;
    onIncrease: (product: ProductInterface) => void;
    onDecrease: (productId: string) => void;
    onRemove: (productId: string) => void;
}

export const CartItem: FC<Props> = (props: Props) => {
    const price = props.product.price || 0;
    const discount = props.product.discount || 0;
    const finalPrice = price * (1 - discount / 100);

    return (
        <div className={styles.cartItem}>
            <img
                src={props.product.image?.[0] || "/placeholder-product.jpg"}
                alt={props.product.title}
                className={styles.productImage}
                loading="lazy"
            />

            <div className={styles.productInfo}>
                <h3 className={styles.productName}>{props.product.title}</h3>
                <p className={styles.productDescription}>{props.product.description}</p>

                <div className={styles.priceContainer}>
                    {discount > 0 ? (
                        <>
                            <span className={styles.originalPrice}>{price.toLocaleString()} ₽</span>
                            <span className={styles.discountedPrice}>{finalPrice.toLocaleString()} ₽</span>
                        </>
                    ) : (
                        <span className={styles.finalPrice}>{price.toLocaleString()} ₽</span>
                    )}
                </div>
            </div>

            <div className={styles.quantityControls}>
                <Button
                    className={styles.quantityButton}
                    onClick={() => props.onDecrease(props.product._id!)}
                    aria-label="Уменьшить количество"
                >
                    −
                </Button>
                <span className={styles.quantity}>{props.count}</span>
                <Button
                    className={styles.quantityButton}
                    onClick={() => props.onIncrease(props.product)}
                    aria-label="Увеличить количество"
                >
                    +
                </Button>
            </div>

            <Button
                className={styles.removeButton}
                onClick={() => props.onRemove(props.product._id!)}
                aria-label="Удалить товар"
            >
                &times;
            </Button>
        </div>
    );
};