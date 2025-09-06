import {useState, useMemo} from 'react';
import styles from './DeliveryPayment.module.sass';
import {Accordion} from '../../lib/accordion/Accordion';
import {Breadcrumbs} from '../../lib/breadcrumbs/Breadcrumbs';

const DELIVERY_OPTIONS = [
    {
        type: "Самовывоз",
        icon: "/delivery/pickup.svg",
        description: "Заберите товар самостоятельно из нашего склада",
        details: [
            "Сделайте онлайн-заказ и получите подтверждение от сотрудника",
            "После оплаты заберите товар по адресу:",
            "350039, г. Краснодар, ул. Кирпичная, 1/2",
            "Пн-Пт с 10:00 до 17:00"
        ]
    },
    {
        type: "Бесплатная доставка",
        icon: "/delivery/free.svg",
        description: "По Краснодару при заказе от 70 000 ₽",
        details: [
            "Доставка до подъезда (тариф 'На улицу')",
            "Минимальная сумма заказа - 70 000 рублей",
            "Выгрузка осуществляется для товаров до 15 кг",
            "Доставка до терминалов ТК 'Деловые линии' или 'ПЭК' - бесплатно"
        ]
    },
    {
        type: "Платная доставка",
        icon: "/delivery/paid.svg",
        description: "В другие регионы и при заказе до 70 000 ₽",
        details: [
            "Стоимость рассчитывается индивидуально",
            "Зависит от веса, габаритов и региона доставки",
            "Возможна доставка в выбранный временной интервал",
            "Услуги транспортной компании оплачиваются отдельно"
        ]
    }
];

const PAYMENT_METHODS = [
    {
        title: "Безналичный расчет",
        description: "Оплата по счет-договору",
        icon: "/payment/invoice.svg"
    },
    {
        title: "Наличными",
        description: "При получении в Краснодаре",
        icon: "/payment/cash.svg"
    },
    {
        title: "Банковской картой",
        description: "VISA, MasterCard, МИР",
        icon: "/payment/card.svg"
    },
    {
        title: "Система быстрых платежей",
        description: "СБП",
        icon: "/payment/sbp.svg"
    },
    {
        title: "SberPay",
        description: "Оплата через Сбербанк",
        icon: "/payment/sberpay.svg"
    },
    {
        title: "Тинькофф",
        description: "Т-БАНК",
        icon: "/payment/tinkoff.svg"
    }
];

const PRICING_FACTORS = [
    {factor: "Вес товаров", icon: "/pricing/weight.svg"},
    {factor: "Габариты товара", icon: "/pricing/dimensions.svg"},
    {factor: "Регион доставки", icon: "/pricing/region.svg"},
    {factor: "Местонахождение товара", icon: "/pricing/location.svg"},
    {factor: "Время доставки", icon: "/pricing/time.svg"}
];

export const DeliveryPayment = () => {
    const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

    const deliveryTerms = useMemo(() => [
        {
            title: "Условия доставки",
            content: (
                <ol className={styles.termsList}>
                    <li>Доставка осуществляется до подъезда, дачи или коттеджа при наличии подъездных путей для
                        грузовиков.
                    </li>
                    <li>Время доставки согласовывается при оформлении заказа. За 60 минут до прибытия вы получите
                        уведомление.
                    </li>
                    <li>Время ожидания покупателя - 30 минут. После этого доставка отменяется.</li>
                    <li>При получении вы можете проверить товар. Претензии фиксируются в акте приёма-передачи.</li>
                    <li>Подъём товара осуществляется, если покупатель берет на себя ответственность за возможные
                        повреждения.
                    </li>
                </ol>
            )
        },
        {
            title: "Возврат товара",
            content: (
                <div className={styles.policyContent}>
                    <p>Процедура возврата регламентируется статьей 26.1 ФЗ «О защите прав потребителей»:</p>
                    <ul>
                        <li>Отказ от товара возможен в течение 7 дней после получения</li>
                        <li>Товар должен сохранить товарный вид и потребительские свойства</li>
                        <li>Не подлежат возврату товары с индивидуальными свойствами</li>
                        <li>Деньги возвращаются в течение 10 дней за вычетом расходов на доставку</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Отказ от услуги",
            content: (
                <div className={styles.policyContent}>
                    <p>Право потребителя на расторжение договора регламентируется статьей 32 ФЗ «О защите прав
                        потребителей»:</p>
                    <ul>
                        <li>Расторжение договора возможно в любое время с оплатой фактически оказанных услуг</li>
                        <li>При обнаружении недостатков вы вправе потребовать:
                            <ul>
                                <li>Безвозмездного устранения недостатков</li>
                                <li>Уменьшения цены услуги</li>
                                <li>Возмещения расходов на устранение недостатков</li>
                            </ul>
                        </li>
                        <li>Требования можно предъявлять в течение гарантийного срока или 2 лет</li>
                    </ul>
                </div>
            )
        }
    ], []);

    const handleAccordionToggle = (index: number) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    return (
        <main className="main__container">
            <Breadcrumbs items={[
                {path: "/", label: "Главная"},
                {path: "/delivery-payment", label: "Оплата и доставка"}
            ]} isLoading={false}/>

            <h1 className="title mb-20">Условия доставки и оплаты</h1>

            <section aria-labelledby="delivery-heading" className={styles.section}>
                <h2 id="delivery-heading">Способы доставки</h2>
                <div className={styles.deliveryGrid}>
                    {DELIVERY_OPTIONS.map((option, index) => (
                        <DeliveryCard key={`delivery-${index}`} {...option} />
                    ))}
                </div>
            </section>

            <section aria-labelledby="pricing-heading" className={styles.section}>
                <h2 id="pricing-heading">Факторы стоимости доставки</h2>
                <p className={styles.sectionDescription}>Итоговая цена доставки зависит от следующих параметров:</p>
                <div className={styles.factorsGrid}>
                    {PRICING_FACTORS.map((factor, index) => (
                        <FactorCard key={`factor-${index}`} {...factor} />
                    ))}
                </div>
                <div className={styles.importantNote}>
                    <strong>Внимание!</strong> При отмене доставки в назначенный срок стоимость не возвращается.
                    Повторная доставка оплачивается отдельно.
                </div>
            </section>

            <section aria-labelledby="payment-heading" className={styles.section}>
                <h2 id="payment-heading">Способы оплаты</h2>
                <p className={styles.sectionDescription}>Выберите удобный для вас вариант оплаты заказа</p>
                <div className={styles.paymentGrid}>
                    {PAYMENT_METHODS.map((method, index) => (
                        <PaymentCard key={`payment-${index}`} {...method} />
                    ))}
                </div>
            </section>

            <section aria-labelledby="terms-heading" className={styles.section}>
                <h2 id="terms-heading">Условия и политики</h2>
                <div className={styles.accordionWrapper}>
                    {deliveryTerms.map((term, index) => (
                        <Accordion
                            key={`term-${index}`}
                            title={term.title}
                            isOpen={activeAccordion === index}
                            onToggle={() => handleAccordionToggle(index)}
                        >
                            {term.content}
                        </Accordion>
                    ))}
                </div>
            </section>
        </main>
    );
};

// Вспомогательные компоненты
const DeliveryCard = ({type, icon, description, details}: typeof DELIVERY_OPTIONS[0]) => (
    <article className={styles.deliveryCard}>
        <div className={styles.cardHeader}>
            <img
                src={icon}
                alt=""
                aria-hidden="true"
                className={styles.cardIcon}
                loading="lazy"
            />
            <h3 className={styles.cardTitle}>{type}</h3>
        </div>
        <p className={styles.cardDescription}>{description}</p>
        <ul className={styles.cardDetails}>
            {details.map((detail, i) => (
                <li key={i}>{detail}</li>
            ))}
        </ul>
    </article>
);

const PaymentCard = ({title, description, icon}: typeof PAYMENT_METHODS[0]) => (
    <article className={styles.paymentCard}>
        <img
            src={icon}
            alt=""
            aria-hidden="true"
            className={styles.paymentIcon}
            loading="lazy"
        />
        <div>
            <h3 className={styles.paymentTitle}>{title}</h3>
            <p className={styles.paymentDescription}>{description}</p>
        </div>
    </article>
);

const FactorCard = ({factor, icon}: typeof PRICING_FACTORS[0]) => (
    <div className={styles.factorCard}>
        <img
            src={icon}
            alt=""
            aria-hidden="true"
            className={styles.factorIcon}
            loading="lazy"
        />
        <span className={styles.factorText}>{factor}</span>
    </div>
);