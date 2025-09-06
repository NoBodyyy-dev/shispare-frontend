// components/Product.tsx
import React from "react";
import {ProductInterface} from "../../store/interfaces/product.interface";
import {useNavigate} from "react-router-dom";
import {StarRating} from "./StarRating";
import ProductPrice from "./ProductPrice";
import styles from "./product.module.sass";
import {QuantityButtons} from "./QuantityButtons.tsx";
import {useAppSelector} from "../../hooks/state.hook.ts";

type Props = {
    productData: ProductInterface;
};

export const Product = React.memo(({productData}: Props) => {
    const {products} = useAppSelector(state => state.cart);
    const navigate = useNavigate();

    const variantIndex = productData.variantIndex ?? 0;
    const variant = productData.variants[variantIndex];

    const handleClickCard = () => {
        navigate(`/categories/${productData.category.slug}/${productData.slug}`);
    };

    return (
        <div className={styles.productItem} onClick={handleClickCard}>
            <div
                style={{
                    background: `url(${productData.images[0]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "200px",
                }}
                className={styles["product__item-image"]}
            />
            <div className={`${styles.productItemContent} mb-10 mt-20`}>
                <div>
                    <p className="text color-gray fz-10 mb-5">Артикул {variant.article}</p>
                    <p className={`text fz-16 `}>{productData.title}</p>
                    <StarRating rating={variant.rating}/>
                </div>
                <ProductPrice discount={variant.discount} price={variant.price}/>
            </div>

            <div className={styles.productItemFooter}>
                <QuantityButtons productId={productData._id}/>
            </div>
        </div>
    );
});