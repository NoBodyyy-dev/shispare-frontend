import { FC, useState, useEffect } from "react";
import { Button } from "../buttons/Button";
import { setCookie, getCookie } from "../../utils/cookie";
import styles from "./cookieBanner.module.sass";

const COOKIE_CONSENT_NAME = "cookieConsent";

export const CookieBanner: FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Проверяем, было ли уже дано согласие на cookie (сначала в cookie, потом в localStorage для обратной совместимости)
        const cookieConsentValue = getCookie(COOKIE_CONSENT_NAME);
        const localStorageConsent = localStorage.getItem(COOKIE_CONSENT_NAME);
        
        // Если нет согласия ни в cookie, ни в localStorage, показываем баннер
        if (!cookieConsentValue && !localStorageConsent) {
            // Небольшая задержка для плавного появления
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 500);
            return () => clearTimeout(timer);
        }
        
        // Если есть в localStorage, но нет в cookie - синхронизируем
        if (!cookieConsentValue && localStorageConsent) {
            try {
                const consentData = JSON.parse(localStorageConsent);
                if (consentData.accepted) {
                    setCookie(COOKIE_CONSENT_NAME, consentData.date, 365);
                }
            } catch (e) {
                // Игнорируем ошибки парсинга
            }
        }
    }, []);

    const handleAccept = () => {
        const consentDate = new Date().toISOString();
        
        // Устанавливаем cookie на 1 год
        setCookie(COOKIE_CONSENT_NAME, consentDate, 365);
        
        // Также сохраняем в localStorage для обратной совместимости
        const consentData = {
            accepted: true,
            date: consentDate
        };
        localStorage.setItem(COOKIE_CONSENT_NAME, JSON.stringify(consentData));
        
        setIsVisible(false);
    };

    const handleDecline = () => {
        const consentDate = new Date().toISOString();
        
        // Устанавливаем cookie с отказом (на 30 дней, чтобы не показывать баннер слишком часто)
        setCookie(COOKIE_CONSENT_NAME, `declined_${consentDate}`, 30);
        
        // Также сохраняем в localStorage для обратной совместимости
        const consentData = {
            accepted: false,
            date: consentDate
        };
        localStorage.setItem(COOKIE_CONSENT_NAME, JSON.stringify(consentData));
        
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.cookieBanner}>
            <div className={styles.cookieBannerContent}>
                <div className={styles.cookieBannerText}>
                    <h3 className={styles.cookieBannerTitle}>Использование Cookie</h3>
                    <p className={styles.cookieBannerDescription}>
                        Мы используем cookie для улучшения работы сайта, персонализации контента 
                        и анализа трафика. Продолжая использовать сайт, вы соглашаетесь на использование cookie.
                    </p>
                </div>
                <div className={styles.cookieBannerActions}>
                    <Button
                        onClick={handleAccept}
                        className={styles.acceptButton}
                    >
                        Принять
                    </Button>
                    <Button
                        onClick={handleDecline}
                        className={styles.declineButton}
                    >
                        Отклонить
                    </Button>
                </div>
            </div>
        </div>
    );
};

