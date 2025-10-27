import styles from "./product.module.sass";

type Props = {
    discount: number;
    price: number;
}

export default function ProductPrice(props: Props) {
    const handlePriceWithDiscount = () => props.price - props.price * props.discount / 100
    if (props.discount) return <div>
        <div className="flex-align-center gap-10 mt-5">
            <p className={`${styles.productCartContentLine} color-gray fz-16`}>{props.price}</p>
            <p className="color-red fz-20">{handlePriceWithDiscount()} руб.</p>
        </div>
    </div>
    return <p className="fz-20">{props.price} руб.</p>
}