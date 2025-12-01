import React from "react";
import { useNavigate } from "react-router-dom";
import { ProductInterface } from "../../store/interfaces/product.interface";
import { StarRating } from "./StarRating";
import { QuantityButtons } from "./QuantityButtons";
import styles from "./product.module.sass";

type Props = {
    productData: ProductInterface;
    variantArticle?: number;
};

export const Product: React.FC<Props> = React.memo(({ productData, variantArticle }) => {
    const navigate = useNavigate();

    const variant = variantArticle
        ? productData.variants?.find((item) => item.article === variantArticle)
        : productData.variants?.[0];

    if (!variant) return null;

    const handleClickCard = () => {
        navigate(`/catalog/${productData.category.slug}/${productData.slug}/${variant.article}`);
    };

    const image = productData.images?.[0] || "./no-image.svg";
    const finalPrice =
        variant.price - (variant.price * (variant.discount || 0)) / 100;

    return (
        <div className={`${styles.card} gap-10`} onClick={handleClickCard}>
            <div className={styles.imageWrapper}>
                <img src={image} alt={productData.title} loading="lazy" />
            </div>

            <div className={styles.info}>
                <p className="fz-12 color-gray">Артикул {variant.article}</p>
                <p className="fz-14">
                    {productData.title}
                </p>
                <div className={styles.variantList}>
                    {variant.color?.ru && variant.color.ru.trim() !== "" && (
                        <span className={styles.variantText}>
                            {variant.color.ru}
                        </span>
                    )}
                    {variant.package?.count && variant.package?.unit && (
                        <span className={styles.variantText}>
                            {variant.package.count} {variant.package.unit}
                        </span>
                    )}
                    {variant.package?.type && (
                        <span className={styles.variantBadge}>{variant.package.type}</span>
                    )}
                </div>

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