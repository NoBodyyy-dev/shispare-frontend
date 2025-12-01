import {FC} from "react";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {SEO} from "../../lib/seo/SEO.tsx";
import styles from "./legal.module.sass";

export const PrivacyPolicyPage: FC = () => {
    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: "/privacy-policy", label: "Политика конфиденциальности"},
    ];

    return (
        <>
            <SEO
                title="Политика конфиденциальности"
                description="Политика конфиденциальности ООО «ШИСПАР». Информация о сборе, использовании и защите персональных данных."
                keywords="политика конфиденциальности, защита данных, персональные данные"
                url="/privacy-policy"
                type="website"
            />
            <div className="main__container">
                <Breadcrumbs items={breadcrumbsItems} isLoading={false}/>
                <h1 className="title mb-20">Политика конфиденциальности</h1>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">1. Общие положения</h2>
                    <p className={styles.text}>
                        Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных
                        пользователей интернет-магазина ООО «ШИСПАР» (далее — «Магазин»).
                    </p>
                    <p className={styles.text}>
                        Использование сайта означает безоговорочное согласие пользователя с настоящей Политикой
                        конфиденциальности и указанными в ней условиями обработки его персональной информации.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">2. Сбор персональных данных</h2>
                    <p className={styles.text}>
                        Магазин собирает следующие персональные данные:
                    </p>
                    <ul className={styles.list}>
                        <li>Фамилия, имя, отчество</li>
                        <li>Контактный телефон</li>
                        <li>Адрес электронной почты</li>
                        <li>Адрес доставки</li>
                        <li>Данные для оплаты (при необходимости)</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">3. Цели сбора персональных данных</h2>
                    <p className={styles.text}>
                        Персональные данные используются для:
                    </p>
                    <ul className={styles.list}>
                        <li>Обработки и выполнения заказов</li>
                        <li>Связи с клиентом по вопросам заказа</li>
                        <li>Доставки товаров</li>
                        <li>Обработки платежей</li>
                        <li>Отправки информационных сообщений (с согласия пользователя)</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">4. Защита персональных данных</h2>
                    <p className={styles.text}>
                        Магазин принимает необходимые организационные и технические меры для защиты персональных
                        данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования,
                        предоставления, распространения, а также от иных неправомерных действий третьих лиц.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">5. Передача персональных данных третьим лицам</h2>
                    <p className={styles.text}>
                        Магазин не передает персональные данные третьим лицам, за исключением случаев, когда это
                        необходимо для выполнения заказа (службы доставки, платежные системы) или требуется
                        законодательством Российской Федерации.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">6. Права пользователя</h2>
                    <p className={styles.text}>
                        Пользователь имеет право:
                    </p>
                    <ul className={styles.list}>
                        <li>Получать информацию о своих персональных данных</li>
                        <li>Требовать уточнения, блокирования или уничтожения персональных данных</li>
                        <li>Отозвать согласие на обработку персональных данных</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">7. Контакты</h2>
                    <p className={styles.text}>
                        По вопросам, связанным с обработкой персональных данных, обращайтесь:
                    </p>
                    <p className={styles.text}>
                        ООО «ШИСПАР»<br/>
                        г. Краснодар, ул. Кирпичная 1/2<br/>
                        Email: shispare@yandex.ru<br/>
                        Телефон: +7 (861) 241-31-37
                    </p>
                </section>

                <section className={styles.section}>
                    <p className={styles.text}>
                        <strong>Дата последнего обновления:</strong> {new Date().toLocaleDateString('ru-RU')}
                    </p>
                </section>
            </div>
        </>
    )
        ;
};



