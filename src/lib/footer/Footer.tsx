import styles from "./footer.module.sass"
import {Link} from "react-router-dom";
import {FaYoutube} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.column}>
                        <h3 className={styles.title}>Контакты</h3>
                        <div className={styles.contacts}>
                            <p className={styles.phone}>+7 (861) 241-31-37</p>
                            <p className={styles.phone}>+7 (988) 312-14-14</p>
                            <p className={styles.email}>shispare@yandex.ru</p>
                            <p className={styles.address}>г. Краснодар, ул. Кирпичная 1/2</p>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.title}>Информация</h3>
                        <nav className={styles.links}>
                            <Link to="/about" className={styles.link}>О компании</Link>
                            <Link to="/contacts" className={styles.link}>Контакты</Link>
                            <Link to="/delivery-payment" className={styles.link}>Доставка и оплата</Link>
                            <Link to="/blog" className={styles.link}>Блог</Link>
                            <Link to="/calculator" className={styles.link}>Калькулятор</Link>
                        </nav>
                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.title}>Правовая информация</h3>
                        <nav className={styles.links}>
                            <Link to="/privacy-policy" className={styles.link}>Политика конфиденциальности</Link>
                            <Link to="/user-agreement" className={styles.link}>Пользовательское соглашение</Link>
                            <Link to="/public-offer" className={styles.link}>Публичная оферта</Link>
                            <Link to="/return-policy" className={styles.link}>Условия возврата</Link>
                        </nav>
                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.title}>Сертификат</h3>
                        <a 
                            href="/files/certificate.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.certificateLink}
                        >
                            <div className={styles.certificateImage}></div>
                            <p className={styles.certificateText}>Сертификат на поставку материалов</p>
                        </a>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.social}>
                        <a 
                            href="https://vk.com/sikarussia" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                        >
                            <FaYoutube />
                        </a>
                    </div>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} ООО «ШИСПАР». Все права защищены.
                    </p>
                </div>
            </div>
        </footer>
    )
}
