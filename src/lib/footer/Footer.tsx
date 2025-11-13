import styles from "./footer.module.sass"
import {Link} from "react-router-dom";
import {FaYoutube} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`${styles.container} flex flex-align-center-sbetw`}>
                <div className="flex gap-20">
                    <p>+7 (861) 241-31-37</p>
                    <p>+7 (988) 312-14-14</p>
                </div>
                <div className="flex gap-5">
                    <Link to="https://vk.com/sikarussia"><FaYoutube /></Link>
                    {/*<Link to="https://clck.ru/3NTxcu"><img src="/dzen.svg" alt=""/></Link>*/}
                </div>
            </div>
        </footer>
    )
}
