import {useState, useMemo} from 'react';
import {Accordion} from '../../lib/accordion/Accordion';
import {Breadcrumbs} from '../../lib/breadcrumbs/Breadcrumbs';
import styles from './deliverypayment.module.sass';
import {DeliveryCard} from "./DeliveryCard.tsx";
import {
    FaFileInvoiceDollar,
    FaTruck,
    FaStore,
    FaMapMarkerAlt,
    FaWeight,
    FaRuler,
    FaGlobe,
    FaWarehouse,
    FaClock,
    FaExclamationTriangle,
    FaCheckCircle,
    FaShieldAlt
} from "react-icons/fa";
import {PiMoneyWavyFill} from "react-icons/pi";
import {IoCard} from "react-icons/io5";
import {MdLocalShipping, MdPayment, MdInfoOutline} from "react-icons/md";
import {HiTruck} from "react-icons/hi2";

const DELIVERY_OPTIONS = [
    {
        type: "Самовывоз",
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
        icon: <FaFileInvoiceDollar />
    },
    {
        title: "Наличными",
        description: "При получении в Краснодаре",
        icon: <PiMoneyWavyFill />
    },
    {
        title: "Банковской картой",
        description: "VISA, MasterCard, МИР",
        icon: <IoCard />
    },
    {
        title: "Система быстрых платежей",
        description: "СБП",
        icon: "../../../public/delivery/sbp.svg"
    },
    {
        title: "SberPay",
        description: "Оплата через Сбербанк",
        icon: "../../../public/delivery/sbp.svg"
    },
    {
        title: "Тинькофф",
        description: "Т-БАНК",
        icon: "../../../public/delivery/sbp.svg"
    }
];

const PRICING_FACTORS = [
    {factor: "Вес товаров", icon: FaWeight},
    {factor: "Габариты товара", icon: FaRuler},
    {factor: "Регион доставки", icon: FaGlobe},
    {factor: "Местонахождение товара", icon: FaWarehouse},
    {factor: "Время доставки", icon: FaClock}
];

export const DeliveryPayment = () => {
    const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

    const deliveryTerms = useMemo(() => [
        {
            title: "Условия доставки",
            content: (
                <ol className={styles.termsList}>
                    <li className="line">Доставка осуществляется до подъезда, дачи или коттеджа при наличии подъездных
                        путей для
                        грузовиков.
                    </li>
                    <li className="line">Время доставки согласовывается при оформлении заказа. За 60 минут до прибытия
                        вы получите
                        уведомление.
                    </li>
                    <li className="line">Время ожидания покупателя - 30 минут. После этого доставка отменяется.</li>
                    <li className="line">При получении вы можете проверить товар. Претензии фиксируются в акте
                        приёма-передачи.
                    </li>
                    <li className="line">Подъём товара осуществляется, если покупатель берет на себя ответственность за
                        возможные
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
                        <li className="line">Отказ от товара возможен в течение 7 дней после получения</li>
                        <li className="line">Товар должен сохранить товарный вид и потребительские свойства</li>
                        <li className="line">Не подлежат возврату товары с индивидуальными свойствами</li>
                        <li className="line">Деньги возвращаются в течение 10 дней за вычетом расходов на доставку</li>
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
                        <li className="line">Расторжение договора возможно в любое время с оплатой фактически оказанных
                            услуг
                        </li>
                        <li className="line">При обнаружении недостатков вы вправе потребовать:
                            <ul>
                                <li className="line">Безвозмездного устранения недостатков</li>
                                <li className="line">Уменьшения цены услуги</li>
                                <li className="line">Возмещения расходов на устранение недостатков</li>
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
                <div className={styles.sectionHeader}>
                    <MdLocalShipping className={styles.sectionIcon} />
                    <h2 id="delivery-heading">Способы доставки</h2>
                </div>
                <div className={styles.deliveryGrid}>
                    {DELIVERY_OPTIONS.map((option, index) => (
                        <DeliveryCard key={`delivery-${index}`} {...option} />
                    ))}
                </div>
            </section>

            <section aria-labelledby="pricing-heading" className={styles.section}>
                <div className={styles.sectionHeader}>
                    <FaTruck className={styles.sectionIcon} />
                    <h2 id="pricing-heading">Факторы стоимости доставки</h2>
                </div>
                <p className={styles.sectionDescription}>Итоговая цена доставки зависит от следующих параметров:</p>
                <div className={styles.factorsGrid}>
                    {PRICING_FACTORS.map((factor, index) => {
                        const IconComponent = factor.icon;
                        return (
                            <FactorCard 
                                key={`factor-${index}`} 
                                factor={factor.factor}
                                icon={<IconComponent />}
                            />
                        );
                    })}
                </div>
                <div className={styles.importantNote}>
                    <FaExclamationTriangle className={styles.warningIcon} />
                    <div>
                        <strong>Внимание!</strong> При отмене доставки в назначенный срок стоимость не возвращается.
                        Повторная доставка оплачивается отдельно.
                    </div>
                </div>
            </section>

            <section aria-labelledby="payment-heading" className={styles.section}>
                <div className={styles.sectionHeader}>
                    <MdPayment className={styles.sectionIcon} />
                    <h2 id="payment-heading">Способы оплаты</h2>
                </div>
                <p className={styles.sectionDescription}>Выберите удобный для вас вариант оплаты заказа</p>
                <div className={styles.paymentGrid}>
                    {PAYMENT_METHODS.map((method, index) => (
                        <PaymentCard key={`payment-${index}`} {...method} />
                    ))}
                </div>
            </section>

            <section aria-labelledby="terms-heading" className={styles.section}>
                <div className={styles.sectionHeader}>
                    <MdInfoOutline className={styles.sectionIcon} />
                    <h2 id="terms-heading">Условия и политики</h2>
                </div>
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


const PaymentCard = ({title, description, icon}: typeof PAYMENT_METHODS[0]) => {
    const isReactElement = typeof icon !== 'string';
    return (
        <article className={styles.paymentCard}>
            <div className={styles.paymentIconWrapper}>
                {isReactElement ? icon : (
                    <img 
                        src={icon} 
                        alt="" 
                        className={styles.paymentIconImage}
                        loading="lazy"
                    />
                )}
            </div>
            <div className={styles.paymentContent}>
                <h3 className={styles.paymentTitle}>{title}</h3>
                <p className={styles.paymentDescription}>{description}</p>
            </div>
        </article>
    );
};

const FactorCard = ({factor, icon}: {factor: string, icon: React.ReactNode}) => (
    <div className={styles.factorCard}>
        <div className={styles.factorIconWrapper}>
            {icon}
        </div>
        <span className={styles.factorText}>{factor}</span>
    </div>
);