import {useEffect, useState, FC} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs";
import {getProductFunc} from "../../store/actions/product.action";
import {useParams} from "react-router-dom";
import {StarRating} from "../../lib/products/StarRating";
import {QuantityButtons} from "../../lib/products/QuantityButtons.tsx";
import {ProductInterface} from "../../store/interfaces/product.interface.ts";
import {SeenStory} from "../../lib/seenstory/YouSeen.tsx"; // предполагаю, что есть такой action
import styles from "../../lib/products/product.module.sass";

export const OneProductPage: FC = () => {
    const dispatch = useAppDispatch();
    const {currentProduct, isLoadingProduct} = useAppSelector((state) => state.product);

    const params = useParams();
    const [variantIndex, setVariantIndex] = useState<number>(0);
    const [curImage, setCurImage] = useState<string>("");

    useEffect(() => {
        if (params["product-slug"]) dispatch(getProductFunc(params["product-slug"]));
    }, [dispatch, params]);

    useEffect(() => {
        if (currentProduct?.images?.length) setCurImage(currentProduct.images[0]);
        if (typeof currentProduct?.variantIndex === "number") setVariantIndex(currentProduct.variantIndex);

        if (currentProduct && currentProduct._id) {
            try {
                const story = localStorage.getItem("story");
                const parsed: ProductInterface[] = story ? JSON.parse(story) : [];
                const withoutCurrent = Array.isArray(parsed)
                    ? parsed.filter((p: ProductInterface) => p && p._id !== currentProduct._id)
                    : [];
                const next = [currentProduct, ...withoutCurrent].slice(0, 4);
                localStorage.setItem("story", JSON.stringify(next));
            } catch {
                localStorage.setItem("story", JSON.stringify([currentProduct]));
            }
        }
    }, [currentProduct]);

    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: `/categories`, label: "Категории"},
        {path: `/product/${currentProduct?.slug}`, label: currentProduct?.title},
    ];

    const currentVariant = currentProduct?.variants?.[variantIndex];

    const calcDiscountPrice = (price: number, discount: number) =>
        discount > 0 ? Math.round(price - (price * discount) / 100) : price;

    return (
        <div className="main__container">
            <Breadcrumbs items={breadcrumbsItems} isLoading={isLoadingProduct}/>

            {isLoadingProduct ? (
                "Загрузка..."
            ) : currentProduct && currentVariant ? (
                <>
                    <div className={`main__block ${styles.oneProduct}`}>
                        <div className="one-currentProduct__images flex gap-10">
                            <div className={styles.oneimagesContainer}>
                                {currentProduct.images.map((image, index) => (
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
                                    alt={currentProduct.title}
                                    className={styles.oneProductSelectedImg}
                                />
                            )}
                        </div>

                        <div className={styles.oneProductInfo}>
                            <div className={`${styles.oneProductInfoBlock} mb-20 p-20`}>
                                <h1 className="title">{currentProduct.title}</h1>

                                <div className="flex-align-center-sbetw">
                                    <p className="color-gray">Артикул: {currentVariant.article}</p>
                                    <StarRating rating={currentVariant.rating || 0}/>
                                </div>

                                <p className="fz-24 color-red mb-20 mt-10">
                                    {calcDiscountPrice(currentVariant.price, currentVariant.discount)} ₽
                                    {currentVariant.discount > 0 && (
                                        <span className="old-price">{currentVariant.price} ₽</span>
                                    )}
                                </p>

                                <div className={styles.onecurrentProductInfoBlockDescription}>
                                    <p>Описание: <span className="font-roboto">{currentProduct.description}</span></p>

                                    <div className="mt-10">
                                        Цвет:
                                        <div
                                            style={{
                                                width: 14,
                                                height: 14,
                                                background: currentVariant.color.en,
                                            }}
                                            title={currentVariant.color.ru}
                                        />
                                    </div>

                                    <p>Упаковка: {currentVariant.package.count} {currentVariant.package.unit} ({currentVariant.package.type})</p>
                                    <p>На паллете: {currentVariant.countOnPallet} шт.</p>
                                    <p>В наличии: {currentVariant.countInStock} шт.</p>
                                    <p>Страна производства: {currentProduct.country}</p>
                                    <p>Срок хранения: {currentProduct.shelfLife}</p>

                                    <QuantityButtons productId={currentProduct._id}/>
                                </div>
                            </div>

                            <div className={`${styles.oneProductInfoBlock} p-20`}>
                                <p className="fz-18 mb-10">Характеристики</p>
                                <ul className="pl-20">
                                    {currentProduct.characteristics.map((ch, index) => (
                                        <li key={index} className="font-roboto line">
                                            {ch}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="main__block">
                        <div className="flex gap-30">
                            <h1 className="title">Отзывы</h1>
                            <StarRating rating={currentVariant.rating || 0}/>
                        </div>
                    </div>
                </>
            ) : (
                <p>Товар не найден</p>
            )}

            <div className="main__block">
                <SeenStory/>
            </div>
        </div>
    );
};