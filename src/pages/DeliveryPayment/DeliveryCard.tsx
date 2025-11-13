import styles from "./deliverypayment.module.sass";

interface DeliveryCardOption {
    type: string;
    description: string;
    details: string[];
}

export const DeliveryCard = ({type, description, details}: DeliveryCardOption) => (
    <article className={styles.deliveryCard}>
        <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{type}</h3>
        </div>
        <p className={styles.cardDescription}>{description}</p>
        <ul className={styles.cardDetails}>
            {details.map((detail, i) => (
                <li className="line" key={i}>{detail}</li>
            ))}
        </ul>
    </article>
);