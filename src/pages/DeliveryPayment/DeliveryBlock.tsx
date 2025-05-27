import styles from "./deliverypayment.module.sass"

type Props = {
    delivery: {
        title: string,
        top: string[]
    }
}

export default function DeliveryBlock(props: Props) {
    return (
        <div className={`${styles.deliveryBlock} p-40`}>
            <div className={`${styles.deliveryBlockTop} flex gap-20`}>

            </div>
            <p className="fz-24 mb-25">{props.delivery.title}</p>
        </div>
    )
}
