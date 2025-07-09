import React from "react";
import {ProductInterface} from "../../store/interfaces/product.interface";
import styles from "./product.module.sass";
import ProductPrice from "./ProductPrice.tsx";
import {useAppDispatch} from "../../hooks/state.hook.ts";
// import {addToCart, decreaseQuantity, removeFromCart} from "../../store/slices/cart.slice.ts";

type Props = {
    productData: ProductInterface;
    count: number;
};

export default React.memo(function ProductInCart(props: Props) {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        console.log(props.productData);
    }, []);

    return (
        <div className={`${styles.productCart} flex mb-10 p-20 gap-20`}>
            <img src={props.productData.image} alt={props.productData.title}/>
            <div className={`${styles.productCartContent} full-width`}>
                <div>
                <span className="flex-align-center-sbetw gap-20">
                    <p className="fz-20">{props.productData.title}</p>
                    <p className="fz-12 color-gray">{props.productData.article}</p>
                </span>
                </div>
                <div className={`flex-align-end-sbetw full-width`}>
                    <ProductPrice discount={props.productData.discount!} price={props.productData.price!}/>
                    <div className="flex">
                        {/*<div className={styles.productCartDelete} onClick={() => dispatch(removeFromCart(props.productData._id!))} />*/}
                        {/*<div className={`${styles.productCartAdd} flex-to-center`} onClick={() => dispatch(addToCart(2props.productData))}>+</div>*/}
                        {props.count}
                        {/*<div onClick={() => dispatch(decreaseQuantity(props.productData._id!))}>-</div>*/}
                    </div>
                </div>
            </div>
        </div>
    );
});
