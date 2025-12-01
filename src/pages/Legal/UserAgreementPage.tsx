import {FC} from "react";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {SEO} from "../../lib/seo/SEO.tsx";
import styles from "./legal.module.sass";

export const UserAgreementPage: FC = () => {
    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: "/user-agreement", label: "Пользовательское соглашение"},
    ];

    return (
        <>
            <SEO
                title="Пользовательское соглашение"
                description="Пользовательское соглашение интернет-магазина ООО «ШИСПАР». Правила использования сайта и оформления заказов."
                keywords="пользовательское соглашение, правила использования, условия использования"
                url="/user-agreement"
                type="website"
            />
            <div className="main__container">
                <Breadcrumbs items={breadcrumbsItems} isLoading={false}/>
                <h1 className="title mb-20">Пользовательское соглашение</h1>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">1. Общие положения</h2>
                    <p className={styles.text}>
                        Настоящее Пользовательское соглашение (далее — «Соглашение») определяет условия использования
                        интернет-магазина ООО «ШИСПАР» (далее — «Магазин») и правила оформления заказов.
                    </p>
                    <p className={styles.text}>
                        Используя сайт Магазина, вы соглашаетесь с условиями настоящего Соглашения. Если вы не
                        согласны с условиями Соглашения, пожалуйста, не используйте сайт Магазина.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">2. Термины и определения</h2>
                    <ul className={styles.list}>
                        <li><strong>Магазин</strong> — интернет-магазин ООО «ШИСПАР»</li>
                        <li><strong>Пользователь</strong> — физическое или юридическое лицо, использующее сайт Магазина
                        </li>
                        <li><strong>Товар</strong> — продукция, представленная в каталоге Магазина</li>
                        <li><strong>Заказ</strong> — оформленный запрос на покупку товара</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">3. Регистрация и учетная запись</h2>
                    <p className={styles.text}>
                        Для оформления заказа пользователь может пройти регистрацию или оформить заказ без регистрации.
                    </p>
                    <p className={styles.text}>
                        Пользователь обязуется предоставлять достоверную информацию при регистрации и несет
                        ответственность за сохранность своих учетных данных.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">4. Оформление заказа</h2>
                    <p className={styles.text}>
                        Заказ считается оформленным после подтверждения Магазином. Магазин оставляет за собой право
                        отказать в оформлении заказа без объяснения причин.
                    </p>
                    <p className={styles.text}>
                        Цены на товары указаны на сайте и могут быть изменены без предварительного уведомления.
                        Окончательная цена определяется на момент подтверждения заказа.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">5. Оплата и доставка</h2>
                    <p className={styles.text}>
                        Способы оплаты и доставки указаны на странице «Доставка и оплата». Магазин не несет
                        ответственности за задержки доставки, вызванные действиями служб доставки или форс-мажорными
                        обстоятельствами.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">6. Возврат товара</h2>
                    <p className={styles.text}>
                        Условия возврата товара регулируются законодательством Российской Федерации и описаны в
                        разделе «Условия возврата».
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">7. Интеллектуальная собственность</h2>
                    <p className={styles.text}>
                        Все материалы сайта (тексты, изображения, логотипы) являются собственностью Магазина и
                        защищены законодательством об интеллектуальной собственности.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">8. Ответственность</h2>
                    <p className={styles.text}>
                        Магазин не несет ответственности за ущерб, причиненный в результате использования или
                        невозможности использования сайта.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">9. Изменения в соглашении</h2>
                    <p className={styles.text}>
                        Магазин оставляет за собой право вносить изменения в настоящее Соглашение. Изменения
                        вступают в силу с момента их публикации на сайте.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">10. Контакты</h2>
                    <p className={styles.text}>
                        ООО «ШИСПАР»<br/>
                        г. Краснодар, ул. Кирпичная 1/2<br/>
                        Email: shispare@yandex.ru<br/>
                        Телефон: +7 (861) 241-31-37
                    </p>
                </section>
            </div>
        </>
    );
};



