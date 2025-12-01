import styles from "./deliverypayment.module.sass";
import {FaStore, FaTruck, FaShippingFast, FaCheckCircle} from "react-icons/fa";

interface DeliveryCardOption {
    type: string;
    description: string;
    details: string[];
}

const getDeliveryIcon = (type: string) => {
    if (type.includes("Самовывоз")) return <FaStore />;
    if (type.includes("Бесплатная")) return <FaShippingFast />;
    return <FaTruck />;
};

export const DeliveryCard = ({type, description, details}: DeliveryCardOption) => (
    <article className={styles.deliveryCard}>
        <div className={styles.cardHeader}>
            <div className={styles.cardIconWrapper}>
                {getDeliveryIcon(type)}
            </div>
            <h3 className={styles.cardTitle}>{type}</h3>
        </div>
        <p className={styles.cardDescription}>{description}</p>
        <ul className={styles.cardDetails}>
            {details.map((detail, i) => (
                <li className="line" key={i}>
                    <FaCheckCircle className={styles.detailIcon} />
                    {detail}
                </li>
            ))}
        </ul>
    </article>
);