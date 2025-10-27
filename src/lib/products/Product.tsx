import React from "react";
import { useNavigate } from "react-router-dom";
import { ProductInterface } from "../../store/interfaces/product.interface";
import { StarRating } from "./StarRating";
import { QuantityButtons } from "./QuantityButtons";
import styles from "./product.module.sass";

type Props = {
    productData: ProductInterface;
};

export const Product: React.FC<Props> = React.memo(({ productData }) => {
    const navigate = useNavigate();

    const handleClickCard = () => {
        navigate(`/categories/${productData.category.slug}/${productData.slug}`);
    };

    const variant = productData.variants?.[0];
    if (!variant) return null;

    const image = productData.images?.[0] || "./no-image.svg";
    const finalPrice =
        variant.price - (variant.price * (variant.discount || 0)) / 100;

    return (
        <div className={`${styles.card} gap-10`} onClick={handleClickCard}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={productData.title} loading="lazy" />
            </div>

            <div className={styles.info}>
                <p className="fz-14">
                    {productData.title}{" "}
                    <span className="fz-12 color-gray">
                        ({variant.color.ru} • {variant.package.type}{" "}
                        {variant.package.count}
                        {variant.package.unit})
                    </span>
                </p>

                <div className={styles.priceBlock}>
                    {variant.discount > 0 && (
                        <span className={styles.oldPrice}>
                            {variant.price.toLocaleString()} ₽
                        </span>
                    )}
                    <span className="fz-18 color-red">
                        {finalPrice.toLocaleString()} ₽
                    </span>
                </div>

                <StarRating
                    rating={productData.displayedRating}
                    totalComments={productData.totalComments}
                />
            </div>

            <div
                className={styles.quantityWrapper}
                onClick={(e) => e.stopPropagation()}
            >
                <QuantityButtons product={productData} article={variant.article} />
            </div>
        </div>
    );
});