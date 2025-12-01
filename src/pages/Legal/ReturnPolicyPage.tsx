import {FC} from "react";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {SEO} from "../../lib/seo/SEO.tsx";
import styles from "./legal.module.sass";

export const ReturnPolicyPage: FC = () => {
    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: "/return-policy", label: "Условия возврата"},
    ];

    return (
        <>
            <SEO
                title="Условия возврата"
                description="Условия возврата и обмена товаров в интернет-магазине ООО «ШИСПАР». Правила возврата товара надлежащего и ненадлежащего качества."
                keywords="возврат товара, обмен товара, условия возврата"
                url="/return-policy"
                type="website"
            />
            <div className="main__container">
                <Breadcrumbs items={breadcrumbsItems} isLoading={false}/>
                <h1 className="title mb-20">Условия возврата</h1>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">1. Общие положения</h2>
                    <p className={styles.text}>
                        Настоящие условия возврата регулируются законодательством Российской Федерации, в частности
                        Законом «О защите прав потребителей» и Правилами продажи товаров дистанционным способом.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">2. Возврат товара надлежащего качества</h2>
                    <p className={styles.text}>
                        Покупатель вправе отказаться от товара надлежащего качества в течение 7 дней с момента
                        передачи товара, если сохранены его товарный вид, потребительские свойства, а также
                        документ, подтверждающий факт и условия покупки указанного товара.
                    </p>
                    <p className={styles.text}>
                        Не подлежат возврату товары надлежащего качества, указанные в Перечне непродовольственных
                        товаров надлежащего качества, не подлежащих возврату или обмену (утвержден Постановлением
                        Правительства РФ от 31.12.2020 № 2463).
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">3. Возврат товара ненадлежащего качества</h2>
                    <p className={styles.text}>
                        Покупатель вправе вернуть товар ненадлежащего качества и потребовать:
                    </p>
                    <ul className={styles.list}>
                        <li>Замены на товар надлежащего качества</li>
                        <li>Соразмерного уменьшения покупной цены</li>
                        <li>Безвозмездного устранения недостатков товара</li>
                        <li>Возмещения расходов на устранение недостатков товара</li>
                        <li>Расторжения договора купли-продажи с возвратом уплаченной суммы</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">4. Порядок возврата товара</h2>
                    <p className={styles.text}>
                        Для возврата товара необходимо:
                    </p>
                    <ol className={styles.orderedList}>
                        <li>Связаться с нами по телефону или email для уведомления о возврате</li>
                        <li>Сохранить товарный вид товара и упаковку</li>
                        <li>Подготовить документы, подтверждающие покупку (чек, накладная)</li>
                        <li>Организовать доставку товара обратно в Магазин</li>
                    </ol>
                    <p className={styles.text}>
                        Расходы на доставку товара при возврате несет Покупатель, за исключением случаев возврата
                        товара ненадлежащего качества.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">5. Возврат денежных средств</h2>
                    <p className={styles.text}>
                        Возврат денежных средств осуществляется тем же способом, которым была произведена оплата,
                        в течение 10 рабочих дней с момента получения товара и проверки его состояния.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">6. Обмен товара</h2>
                    <p className={styles.text}>
                        Покупатель вправе обменять товар надлежащего качества на аналогичный товар, если товар не
                        подошел по форме, габаритам, фасону, расцветке, размеру или комплектации.
                    </p>
                    <p className={styles.text}>
                        Обмен товара производится при наличии товара в наличии. Если аналогичный товар отсутствует
                        в продаже, Покупатель вправе вернуть товар и получить уплаченную сумму.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className="subtitle mb-15">7. Контакты для возврата</h2>
                    <p className={styles.text}>
                        По вопросам возврата товара обращайтесь:
                    </p>
                    <p className={styles.text}>
                        ООО «ШИСПАР»<br/>
                        г. Краснодар, ул. Кирпичная 1/2<br/>
                        Email: shispare@yandex.ru<br/>
                        Телефон: +7 (861) 241-31-37, +7 (988) 312-14-14
                    </p>
                </section>
            </div>
        </>
    );
};



