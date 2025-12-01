import {FC} from "react";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {SEO} from "../../lib/seo/SEO.tsx";
import styles from "./legal.module.sass";

export const PublicOfferPage: FC = () => {
    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: "/public-offer", label: "Публичная оферта"},
    ];

    return (
        <>
            <SEO
                title="Публичная оферта"
                description="Публичная оферта на заключение договора купли-продажи товаров в интернет-магазине ООО «ШИСПАР»."
                keywords="публичная оферта, договор купли-продажи, условия покупки"
                url="/public-offer"
                type="website"
            />
            <div className="main__container">
                <Breadcrumbs items={breadcrumbsItems} isLoading={false} />
                    <h1 className="title mb-20">Публичная оферта</h1>
                    
                    <section className={styles.section}>
                        <h2 className="subtitle mb-15">1. Общие положения</h2>
                        <p className={styles.text}>
                            Настоящий документ является публичной офертой (далее — «Оферта») в адрес физических и 
                            юридических лиц (далее — «Покупатель») о заключении договора купли-продажи товаров 
                            дистанционным способом на условиях, изложенных ниже.
                        </p>
                        <p className={styles.text}>
                            В соответствии с пунктом 2 статьи 437 Гражданского кодекса Российской Федерации, в случае 
                            принятия изложенных ниже условий лицо, производящее акцепт этой оферты, становится Покупателем.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className="subtitle mb-15">2. Предмет договора</h2>
                        <p className={styles.text}>
                            Продавец обязуется передать в собственность Покупателя товар, а Покупатель обязуется 
                            принять товар и уплатить за него цену в порядке и на условиях, установленных настоящей Офертой.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className="subtitle mb-15">3. Момент заключения договора</h2>
                        <p className={styles.text}>
                            Договор считается заключенным с момента получения Продавцом сообщения о намерении Покупателя 
                            приобрести товар (оформление заказа на сайте) и подтверждения заказа Продавцом.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className="subtitle mb-15">4. Цена товара и порядок оплаты</h2>
                        <p className={styles.text}>
                            Цена товара указывается на сайте и может быть изменена Продавцом в одностороннем порядке. 
                            Цена товара действительна на момент подтверждения заказа.
                        </p>
                        <p className={styles.text}>
                            Оплата товара производится способами, указанными на сайте в разделе «Доставка и оплата».
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className="subtitle mb-15">5. Доставка товара</h2>
                        <p className={styles.text}>
                            Доставка товара осуществляется способами и в сроки, указанные на сайте. Стоимость доставки 
                            рассчитывается при оформлении заказа.
                        </p>
                        <p className={styles.text}>
                            Риск случайной гибели или повреждения товара переходит к Покупателю с момента передачи товара 
                            в службу доставки.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className="subtitle mb-15">6. Права и обязанности сторон</h2>
                        <p className={styles.text}>
                            <strong>Продавец обязуется:</strong>
                        </p>
                        <ul className={styles.list}>
                            <li>Передать Покупателю товар надлежащего качества</li>
                            <li>Обеспечить доставку товара в согласованные сроки</li>
                            <li>Предоставить необходимую информацию о товаре</li>
                        </ul>
                        <p className={styles.text}>
                            <strong>Покупатель обязуется:</strong>
                        </p>
                        <ul className={styles.list}>
                            <li>Оплатить товар в установленные сроки</li>
                            <li>Принять товар при доставке</li>
                            <li>Предоставить достоверную информацию при оформлении заказа</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className="subtitle mb-15">7. Ответственность сторон</h2>
                        <p className={styles.text}>
                            Стороны несут ответственность за неисполнение или ненадлежащее исполнение обязательств по 
                            настоящему договору в соответствии с законодательством Российской Федерации.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className="subtitle mb-15">8. Реквизиты Продавца</h2>
                        <p className={styles.text}>
                            <strong>ООО «ШИСПАР»</strong><br />
                            Адрес: г. Краснодар, ул. Кирпичная 1/2<br />
                            Email: shispare@yandex.ru<br />
                            Телефон: +7 (861) 241-31-37, +7 (988) 312-14-14
                        </p>
                    </section>

                    <section className={styles.section}>
                        <p className={styles.text}>
                            <strong>Дата публикации:</strong> {new Date().toLocaleDateString('ru-RU')}
                        </p>
                    </section>
            </div>
        </>
    );
};



