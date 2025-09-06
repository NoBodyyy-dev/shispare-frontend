import axios from "axios";
import {FC, useEffect} from "react";
import {CartSummary} from "./CartSummary";
import {CartItem} from "../../lib/products/ProductInCart.tsx";
import {useAppSelector} from "../../hooks/state.hook.ts";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import styles from "./cart.module.sass";
import {SeenStory} from "../../lib/seenstory/YouSeen.tsx";

export const Cart: FC = () => {
    const {products} = useAppSelector(state => state.cart)

    useEffect(() => {
        axios.get("https://suggest-maps.yandex.ru/v1/suggest?apikey=a343e3ef-bfdd-4222-b31d-7c33ee9c2825&text=60-летия").then(r => {
            console.log(r)
        })
    }, [])

    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: "/cart", label: "Корзина"}
    ]

    return (
        <div className="main__container">
            <Breadcrumbs items={breadcrumbsItems} isLoading={false}/>
            <h1 className="title mb-20">Корзина</h1>
            {products.length
                ? <div className={`${styles.container} main__block gap-20`}>
                    <div>
                        <div className={styles.items}>
                            {products.map(item => (
                                <CartItem
                                    key={item.product._id}
                                    item={item}
                                />
                            ))}
                        </div>
                    </div>
                    <CartSummary isRedirect={true}/>
                </div>
                : <div className={`${styles.empty} main__block`}>
                    <h1 className="title center color-gray">Корзина пустая</h1>
                </div>
            }
            <div className="main__block">
                <SeenStory/>
            </div>
        </div>
    );
};