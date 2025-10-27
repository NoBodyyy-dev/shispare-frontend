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
    category: CategoryData;
    variants: IProductVariant[];
    variantIndex: number;
}

export const ProductSuggestions = (props: Props) => {
    const { _id, title, slug, images, category, variants, variantIndex } = props;
    const navigate = useNavigate();
    const variant = variants[variantIndex];

    const handleClick = () => {
        navigate(`/category/${category.slug}/${slug}`);
    }

    const displayText = `${title} (${variant.color.ru}, ${variant.package.type}, ${variant.package.unit})`;

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
                <div className={styles.suggestionCategory}>{category.title}</div>
            </div>
        </div>
    );
};