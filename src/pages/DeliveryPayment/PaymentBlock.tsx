import styles from "./deliverypayment.module.sass"

type Props = {
    title: string;
    image: string;
}

export default function PaymentBlock(props: Props) {
    return (
        <div className={`${styles.paymentBlock} flex-to-center-col`}>
            <p className="fz-24 center mb-10">{props.title}</p>
            <img src={props.image} alt={props.title}/>
        </div>
    )
}
