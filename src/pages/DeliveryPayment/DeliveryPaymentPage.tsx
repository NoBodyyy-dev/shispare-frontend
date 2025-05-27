import styles from "./deliverypayment.module.sass"
import DeliveryBlock from "./DeliveryBlock.tsx";
import PaymentBlock from "./PaymentBlock.tsx";
import Breadcrumbs from "../../lib/breadcrumbs/Breadcrumbs.tsx";

export default function DeliveryPayment() {
    const items = [
        {path: "/", label: "Главная"},
        {path: "/delivery-payment", label: "Оплата и доставка"},
    ]


    const deliveryInformation = [
        {
            title: "Самовывоз",

        }
    ]

    const paymentInformation = [
        {
            title: "Наличными",
            image: "/delivery/cash.svg"
        },
        {
            title: "Картой",
            image: "/delivery/card.svg"
        },
        {
            title: "СБП",
            image: "/delivery/sbp.svg"
        },
        {
            title: "SberPay",
            image: "/delivery/sbp.svg"
        },
        {
            title: "Т-БАНК",
            image: "/delivery/sbp.svg"
        },
    ]

    return (
        <div className="main__container">
            <Breadcrumbs items={items} isLoading={false}/>
            <div className="main__block">
                <h1 className="title mb-25">Условия доставки</h1>
                {/*{deliveryInformation.map((item, index) => {*/}
                {/*    return <DeliveryBlock delivery={item} key={index}/>*/}
                {/*})}*/}
            </div>
            <div className="main__block">
                <h1 className="title mb-25">Тарифы</h1>
                {/*{deliveryInformation.map((item, index) => {*/}
                {/*    return <DeliveryBlock delivery={item} key={index}/>*/}
                {/*})}*/}
            </div>
            <div className="main__block">
                <h1 className="title mb-25">Оплата</h1>
                <div className={styles.payment}>
                    {paymentInformation.map((item, index) => {
                        return <PaymentBlock key={index} title={item.title} image={item.image}/>
                    })}
                </div>
            </div>
            <div className="main__block">
                <h1 className="title mb-25">Отказ от услуги</h1>

            </div>
            <div className="main__block">
                <h1 className="title mb-25">Возврат</h1>

            </div>
        </div>
    )
}
