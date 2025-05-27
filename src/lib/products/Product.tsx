import React from "react";
import {ProductInterface} from "../../store/interfaces/product.interface";
import Button from "../buttons/Button";
import styles from "./product.module.sass";
import {useNavigate} from "react-router-dom";
import StarRating from "./StarRating";
import {addToCart} from "../../store/slices/cart.slice";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import ProductPrice from "./ProductPrice.tsx";

type Props = {
    productData: ProductInterface;
};

export default React.memo(function Product(props: Props) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const cartItems = useAppSelector(state => state.cart); // Получаем текущее состояние корзины
    const isInCart = cartItems.cart[props.productData._id!] !== undefined; // Определяем, есть ли товар в корзине

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        dispatch(addToCart(props.productData!));
    };

    const handleClickCard = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        navigate(
            `/categories/${props.productData.category!.slug}/${props.productData.slug}`
        );
    };

    console.log(props.productData.price)

    return (
        <div className={`${styles.productItem}`} onClick={handleClickCard}>
            <div
                style={{
                    background: `url(${props.productData.productImages![0]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "200px",
                }}
                className={styles["product__item-image"]}
            />
            <div className={`${styles.productItemContent} mb-10 mt-20`}>
                <div>
                    <p className="text color-gray fz-10 mb-5">Артикул {props.productData.article}</p>
                    <p className={`text fz-16 `}>{props.productData.title}</p>
                    <StarRating rating={props.productData.rating!}/>
                </div>
                <ProductPrice discount={props.productData.discount!} price={props.productData.price!}/>
            </div>
            <Button
                className={`${styles.productItemButton} full ${isInCart ? "disabled" : ""}`}
                onClick={handleAddToCart}
                disabled={isInCart}
            >
                {isInCart ? "В корзине" : "В корзину"}
            </Button>
        </div>
    );
});