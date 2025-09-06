import {useCallback, useRef, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {Button} from "../buttons/Button.tsx";
import {
    addToCart,
    removeFromCart,
    updateQuantity
} from "../../store/actions/cart.action.ts";
import {
    rollbackQuantity,
    updateQuantityLocal,
    removeItemLocal
} from "../../store/slices/cart.slice.ts";
import {debounce} from "../../hooks/util.hook.ts";
import styles from "./product.module.sass"

type Props = {
    productId: string;
};

export const QuantityButtons = ({productId}: Props) => {
    const dispatch = useAppDispatch();
    const {products, isLoading} = useAppSelector(state => state.cart);

    const debouncedUpdateRef = useRef<ReturnType<typeof debounce> | null>(null);
    const prevQuantityRef = useRef<number>(0);

    const cartItem = products.find(item => item.product._id === productId);
    console.log(cartItem);

    useEffect(() => {
        return () => {
            if (debouncedUpdateRef.current?.cancel) {
                debouncedUpdateRef.current.cancel();
            }
        };
    }, []);

    const handleAddToCart = useCallback(() => {
        dispatch(addToCart({productId, quantity: 1}));
    }, [dispatch, productId]);

    const sendUpdateToServer = useCallback((newQuantity: number) => {
        dispatch(updateQuantity({productId, quantity: newQuantity}))
            .unwrap()
            .catch((error) => {
                console.error("Ошибка обновления количества:", error);
                // Откатываем изменения в случае ошибки
                dispatch(rollbackQuantity({
                    productId,
                    prevQuantity: prevQuantityRef.current
                }));
            });
    }, [dispatch, productId]);

    const handleUpdateQuantity = useCallback((newQuantity: number) => {
        if (!cartItem) return;
        prevQuantityRef.current = cartItem.quantity;
        dispatch(updateQuantityLocal({productId, quantity: newQuantity}));
        if (debouncedUpdateRef.current?.cancel) debouncedUpdateRef.current.cancel();

        debouncedUpdateRef.current = debounce(() => {
            sendUpdateToServer(newQuantity);
        }, 2000);

        debouncedUpdateRef.current();
    }, [dispatch, cartItem, productId, sendUpdateToServer]);

    const handleIncrement = useCallback(() => {
        if (!cartItem) return;
        handleUpdateQuantity(cartItem.quantity + 1);
    }, [cartItem, handleUpdateQuantity]);

    const handleDecrement = useCallback(() => {
        if (!cartItem) return;

        if (cartItem.quantity === 1) {
            if (debouncedUpdateRef.current?.cancel) debouncedUpdateRef.current.cancel();

            dispatch(removeItemLocal({productId}));

            dispatch(removeFromCart({productId}))
                .unwrap()
                .catch((error) => {
                    console.error("Ошибка удаления товара:", error);
                    // В случае ошибки - возвращаем товар
                    dispatch(addToCart({productId, quantity: 1}));
                });
        } else {
            handleUpdateQuantity(cartItem.quantity - 1);
        }
    }, [dispatch, cartItem, productId, handleUpdateQuantity]);

    if (!cartItem?.product._id) {
        return (
            <Button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {isLoading ? "Загрузка..." : "В корзину"}
            </Button>
        );
    }

    const disabledDecrement = cartItem!.quantity <= 1
    const disabledIncrement = cartItem!.quantity >= cartItem!.product.variants[cartItem!.product.variantIndex].countInStock

    return (
        <div className={styles.quantity}>
            <Button
                onClick={handleDecrement}
                disabled={disabledDecrement}
                className={""}
                aria-label="Уменьшить количество"
            >
                -
            </Button>

            <p>{cartItem.quantity}</p>

            <Button
                onClick={handleIncrement}
                disabled={disabledIncrement}
                className={""}
                aria-label="Увеличить количество"
            >
                +
            </Button>
        </div>
    );
};