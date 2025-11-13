// ProductSuggestions.tsx
import {useNavigate} from "react-router-dom";
import {IProductVariant} from "../../store/interfaces/product.interface.ts";
import {CategoryData} from "../../store/interfaces/category.interface.ts";
import styles from "./product.module.sass";

type Props = {
    _id: string;
    title: string;
    slug: string;
    images: string[];
    category: CategoryData | null;
    variants: IProductVariant[];
    variantIndex: number;
    onSelect?: () => void;
}

export const ProductSuggestions = (props: Props) => {
    const { _id, title, slug, images, category, variants, variantIndex, onSelect } = props;
    const navigate = useNavigate();
    const variant = variants && variants.length > 0 ? variants[variantIndex || 0] : null;

    const handleClick = () => {
        if (category && variant && category.slug) {
            if (onSelect) {
                onSelect();
            }
            navigate(`/categories/${category.slug}/${variant.article}`);
        }
    }

    const displayText = variant 
        ? `${title} (${variant.color.ru}, ${variant.package.type}, ${variant.package.unit})`
        : title;

    return (
        <div className={styles.suggestionItem} onClick={handleClick}>
            {images[0] && (
                <img
                    src={images[0]}
                    alt={title}
                    className={styles.suggestionImage}
                />
            )}
            <div className={styles.suggestionContent}>
                <div className={styles.suggestionTitle}>{displayText}</div>
                {category && (
                    <div className={styles.suggestionCategory}>{category.title || category.name}</div>
                )}
            </div>
        </div>
    );
};