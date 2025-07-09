import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook";
import Breadcrumbs from "../../lib/breadcrumbs/Breadcrumbs";
import {getProductFunc} from "../../store/actions/product.action";
import {useParams} from "react-router-dom";
import StarRating from "../../lib/products/StarRating.tsx";
import styles from "../../lib/products/product.module.sass"
import Button from "../../lib/buttons/Button.tsx";

export const OneProductPage: FC = () => {
    const dispatch = useAppDispatch();
    const {product, isLoadingProduct} = useAppSelector(
        (state) => state.product
    );
    const params = useParams();
    const [isInCart, setIsInCart] = useState<boolean>(false);
    const [curImage, setCurImage] = useState<string>("");

    useEffect(() => {
        dispatch(getProductFunc(params["product-slug"]!));
    }, [dispatch, params]);

    useEffect(() => {
        if (product?.productImages?.length) {
            setCurImage(product.productImages[0]);
        }
    }, [product]);

    const breadcrumbsItems = [
        {
            path: "/",
            label: "Главная"
        },
        {
            path: `/categories`,
            label: "Категории",
        },
        {
            path: `/categories/${product?.category?.slug}`,
            label: product?.category?.title,
        },
        {
            path: `/categories/${product?.category?.slug}/${product?.slug}`,
            label: product?.title,
        },
    ];

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!product?._id) return;

        const cart = JSON.parse(localStorage.getItem("cart") || "{}");
        cart[product._id] = {...product};
        localStorage.setItem("cart", JSON.stringify(cart));
        setIsInCart(true);
    };

    useEffect(() => {
        if (product?._id) {
            const cart = JSON.parse(localStorage.getItem("cart") || "{}");
            setIsInCart(cart[product._id] !== undefined);
        }
    }, [product?._id]);

    return (
        <div className={`main__container`}>
            <Breadcrumbs items={breadcrumbsItems} isLoading={isLoadingProduct}/>
            <div className={`main__block ${styles.oneProduct}`}>
                <div className="one-product__images flex gap-10">
                    <div className={`${styles.oneProductImagesContainer}`}>
                        {product.productImages?.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt=""
                                onClick={() => setCurImage(image)}
                            />
                        ))}
                    </div>
                    {curImage && (
                        <img
                            src={curImage}
                            alt={product.title}
                            className={styles.oneProductSelectedImg}
                        />
                    )}
                </div>
                <div className={styles.oneProductInfoB}>
                    <div className={`${styles.oneProductInfoBlock} mb-20 p-20`}>
                        <h1 className="title">{product.title}</h1>
                        <div className="flex-align-center-sbetw">
                            <p className="color-gray">{product.article}</p>
                            <StarRating rating={product.rating || 0}/>
                        </div>
                        <p className="fz-24 color-red mb-20 mt-10">{product.price}</p>
                        <div className={styles.oneProductInfoBlockDescription}>
                            <p>Описание - <span className="font-roboto">{product.description}</span></p>
                            <div>
                                Цвет - {!product.colors?.length
                                ? "Нет данных"
                                : product.colors.map((color) => (
                                    <span
                                        className="inline-block"
                                        style={{width: 10, height: 10, background: color, marginRight: 5}}
                                        key={color}
                                    />
                                ))
                            }
                            </div>
                            <p>Расход: <span className="font-roboto">{product.consumption} g/m</span></p>
                            <p>В наличии: <span className="font-roboto">{product.countProducts}</span></p>
                            <p>Категория: <a
                                href={`/categories/${product.category?.slug}`}
                                className="font-roboto color-blue"
                            >
                                {product.category?.title}
                            </a>
                            </p>
                            <Button
                                className={`full mt-20 ${isInCart ? "disabled" : ""}`}
                                onClick={handleAddToCart}
                                disabled={isInCart}
                            >
                                {isInCart ? "В корзине" : "В корзину"}
                            </Button>
                        </div>
                    </div>
                    <div className={`${styles.oneProductInfoBlock} p-20`}>
                        <p className="fz-18 mb-10">Характеристики</p>
                        <ul className="pl-20">
                            {product.characteristics?.map((characteristic, index) => (
                                <li
                                    key={index}
                                    className="font-roboto line"
                                >
                                    {characteristic}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="main__block">
                <div className="flex gap-30">
                    <h1 className="title">Отзывы</h1>
                    <StarRating rating={product.rating || 0}/>
                </div>
            </div>
        </div>
    );
};