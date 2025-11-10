import {useEffect, useState, FC} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs";
import {getProductFunc} from "../../store/actions/product.action";
import {Link, useParams} from "react-router-dom";
import {StarRating} from "../../lib/products/StarRating";
import {QuantityButtons} from "../../lib/products/QuantityButtons";
import {ProductInterface} from "../../store/interfaces/product.interface";
import {SeenStory} from "../../lib/seenstory/YouSeen";
import styles from "../../lib/products/product.module.sass";

export const OneProductPage: FC = () => {
    const dispatch = useAppDispatch();
    const {currentProduct, isLoadingProduct} = useAppSelector((state) => state.product);

    const params = useParams();
    const [curImage, setCurImage] = useState<string>("");
    const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

    const paramsArticle = Number(params["article"]);
    console.log(params)

    useEffect(() => {
        if (paramsArticle) dispatch(getProductFunc(paramsArticle));
    }, [paramsArticle]);

    useEffect(() => {
        console.log("--------=-=-=-=-=-=-", currentProduct);
    }, [currentProduct?._id]);

    useEffect(() => {
        if (currentProduct?.images?.length) setCurImage(currentProduct.images[0]);
        if (currentProduct && currentProduct._id) {
            try {
                const story = localStorage.getItem("story");
                const parsed: ProductInterface[] = story ? JSON.parse(story) : [];
                const next = [currentProduct, ...parsed.filter(p => p._id !== currentProduct._id)].slice(0, 4);
                localStorage.setItem("story", JSON.stringify(next));
            } catch {
                localStorage.setItem("story", JSON.stringify([currentProduct]));
            }
        }
        if (currentProduct?.variants?.length) {
            setSelectedArticle(currentProduct.variants[0].article);
        }
    }, [currentProduct]);

    if (isLoadingProduct) return <p className="main__container">Загрузка...</p>;
    if (!currentProduct) return <p className="main__container">Товар не найден</p>;

    const variant = currentProduct.variants.find((v) => v.article === paramsArticle);
    if (!variant) return <p className="main__container">Вариант не найден</p>;

    const calcDiscountPrice = (price: number, discount: number) =>
        discount > 0 ? Math.round(price - (price * discount) / 100) : price;

    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: `/categories`, label: "Категории"},
        {path: `/categories/${currentProduct.category?.slug}/${paramsArticle}`, label: currentProduct.title},
    ];

    return (
        <div className="main__container">
            <Breadcrumbs items={breadcrumbsItems} isLoading={isLoadingProduct}/>

            <div className={`main__block ${styles.oneProduct}`}>
                <div className="one-currentProduct__images flex gap-10">
                    <div className={styles.imagesBlock}>
                        {currentProduct.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt=""
                                onClick={() => setCurImage(image)}
                                className={`${styles} ${curImage === image ? styles.activeThumb : ""}`}
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
                            <p className="color-gray">Артикул: {variant.article}</p>
                            <StarRating rating={currentProduct.displayedRating}
                                        totalComments={currentProduct.totalComments}/>
                        </div>

                        <p className="fz-24 color-red mb-20 mt-10">
                            {calcDiscountPrice(variant.price, variant.discount)} ₽{" "}
                            {variant.discount > 0 && (
                                <span className="old-price">{variant.price} ₽</span>
                            )}
                        </p>

                        {currentProduct.variants.length > 1 && (
                            <div className="flex gap-10 mb-15">
                                {currentProduct.variants.map((v) => (
                                    <div
                                        key={v.article}
                                        onClick={() => setSelectedArticle(v.article)}
                                        className={`${styles.colorCircle} ${
                                            selectedArticle === v.article ? styles.activeColor : ""
                                        }`}
                                        style={{background: v.color.hex}}
                                        title={v.color.ru}
                                    />
                                ))}
                            </div>
                        )}

                        <p className="font-roboto">{currentProduct.description}</p>
                        <p className="mt-10">Цвет: {variant.color.ru}</p>
                        <p>
                            Упаковка: {variant.package.count} {variant.package.unit} ({variant.package.type})
                        </p>
                        <p>В наличии: {variant.countInStock} шт.</p>
                        <p>Страна производства: {currentProduct.country}</p>
                        <p>Срок хранения: {12} мес.</p>

                        <p className="mt-10 mb-10">Другие варианты товара:</p>
                        <div className="flex gap-5">
                            {currentProduct.variants.map(v => {
                                return <Link to={`/categories/${currentProduct.category?.slug}/${v.article}`}>
                                    <div style={{backgroundColor: v.color.hex}}>
                                        {v.color.ru} {v.package.type} {v.package.count} {v.package.unit}
                                    </div>
                                </Link>
                            })}
                        </div>

                        <div className="mt-15">
                            <QuantityButtons product={currentProduct} article={variant.article}/>
                        </div>
                    </div>

                    <div className={`${styles.oneProductInfoBlock} p-20`}>
                        <p className="fz-18 mb-10">Характеристики</p>
                        <ul className="pl-20">
                            {currentProduct.characteristics?.length && currentProduct.characteristics!.map((ch, index) => (
                                <li key={index} className="font-roboto line">
                                    {ch}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="main__block mt-20">
                <div className="flex gap-30">
                    <h1 className="title">Отзывы</h1>
                    <StarRating
                        rating={currentProduct.displayedRating}
                        totalComments={currentProduct.totalComments}
                    />
                </div>

            </div>
            <div className="main__block">
                <SeenStory/>
            </div>
        </div>
    );
};