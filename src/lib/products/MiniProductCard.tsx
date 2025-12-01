import {memo} from "react";
import {ProductInterface} from "../../store/interfaces/product.interface.ts";
import styles from "./product.module.sass"
import {StarRating} from "./StarRating.tsx";
import {Link} from "react-router-dom";

type Props = {
    product: ProductInterface
}

export const MiniProductCard = memo((props: Props) => {
    const variant = props.product.variants?.[0];
    if (!variant) return null;

    return <Link to={`/catalog/${props.product.category.slug}/${props.product.slug}/${variant.article}`}>
        <div className={`${styles.card} gap-10`}>
            <div className={styles.imageWrapper}>
                <img src={props.product.images[0]} alt={props.product.title} loading="lazy"/>
            </div>

            <div className={styles.info}>
                <p className="fz-12 color-gray">Артикул {props.product.variants[0].article}</p>
                <p className="fz-14">{props.product.title}</p>
                <StarRating
                    rating={props.product.displayedRating}
                    totalComments={props.product.totalComments}
                />
            </div>
        </div>
    </Link>
})