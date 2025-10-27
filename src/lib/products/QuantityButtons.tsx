import { MouseEvent, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/state.hook";
import { Button } from "../buttons/Button";
import styles from "./product.module.sass";
import { ProductInterface } from "../../store/interfaces/product.interface";
import { setQuantitySmart } from "../../store/slices/cart.slice";
import {useAuth} from "../../context/AuthContext.tsx";

type Props = {
    product: ProductInterface;
    article: number;
};

export const QuantityButtons = ({ product, article }: Props) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAuth();
    const { products, isLoading } = useAppSelector((s) => s.cart);

    const cartItem = products.find(
        (p) => p.product._id === product._id && p.article === article
    );
    const variant = useMemo(
        () => product.variants?.find((v) => v.article === article),
        [product, article]
    );

    const qty = cartItem?.quantity || 0;
    const inStock = variant?.countInStock ?? 0;

    const setQty = useCallback(
        (newQty: number) => {
            setQuantitySmart({
                dispatch,
                product,
                article,
                quantity: newQty,
                isAuthenticated,
                prevQuantity: qty,
            });
        },
        [dispatch, product, article, qty, isAuthenticated]
    );

    const handleAdd = (e: MouseEvent) => {
        e.stopPropagation();
        if (inStock <= 0) return;
        setQty(1);
    };

    const handleInc = (e: MouseEvent) => {
        e.stopPropagation();
        if (qty < inStock) setQty(qty + 1);
    };

    const handleDec = (e: MouseEvent) => {
        e.stopPropagation();
        if (qty <= 1) setQty(0);
        else setQty(qty - 1);
    };

    if (!variant || inStock <= 0) {
        return (
            <Button disabled className={`${styles.disabled} full-width`}>
                Нет в наличии
            </Button>
        );
    }

    if (qty <= 0) {
        return (
            <Button
                onClick={handleAdd}
                disabled={isLoading}
                loading={isLoading}
                className="full-width"
            >
                В корзину
            </Button>
        );
    }

    return (
        <div className={`${styles.quantity} full-width gap-8 flex-align-center-sbetw`}>
            <Button onClick={handleDec} disabled={isLoading}>
                -
            </Button>
            <p className="fz-16">{qty}</p>
            <Button
                onClick={handleInc}
                disabled={isLoading || qty >= inStock}
            >
                +
            </Button>
        </div>
    );
};