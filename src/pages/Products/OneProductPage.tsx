import {useEffect, useState, FC} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs";
import {getProductFunc} from "../../store/actions/product.action";
import {Link, useNavigate, useParams} from "react-router-dom";
import {StarRating} from "../../lib/products/StarRating";
import {QuantityButtons} from "../../lib/products/QuantityButtons";
import {ProductInterface} from "../../store/interfaces/product.interface";
import {SeenStory} from "../../lib/seenstory/YouSeen";
import {Modal} from "../../lib/modal/Modal";
import {CreateReviewForm} from "../../lib/products/CreateReviewForm";
import {createCommentFunc, getProductCommentsFunc, checkCanCommentFunc} from "../../store/actions/comment.action";
import {useAuth} from "../../context/AuthContext";
import {Button} from "../../lib/buttons/Button";
import {CommentCard} from "../../lib/comments/CommentCard";
import {SEO} from "../../lib/seo/SEO";
import {Pagination} from "../../lib/pagination/Pagination";
import {FaCalculator, FaFileDownload} from "react-icons/fa";
import styles from "../../lib/products/product.module.sass";

export const OneProductPage: FC = () => {
    const dispatch = useAppDispatch();
    const {currentProduct, isLoadingProduct} = useAppSelector((state) => state.product);
    const {
        isLoadingActionComment,
        comments,
        pagination,
        isLoadingComments,
        canComment,
        canCommentReason,
        isLoadingCanComment
    } = useAppSelector((state) => state.comment);
    const {isAuthenticated} = useAuth();

    const params = useParams();
    const navigate = useNavigate();
    const [curImage, setCurImage] = useState<string>("");
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const paramsArticle = Number(params["article"]);

    useEffect(() => {
        if (paramsArticle) dispatch(getProductFunc(paramsArticle));
    }, [paramsArticle, dispatch]);

    useEffect(() => {
        if (currentProduct?._id) {
            dispatch(getProductCommentsFunc({productId: currentProduct._id, page: currentPage, limit: 5}));
            if (isAuthenticated) {
                dispatch(checkCanCommentFunc(currentProduct._id));
            }
        }
    }, [currentProduct?._id, currentPage, dispatch, isAuthenticated]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (currentProduct?._id) {
            dispatch(getProductCommentsFunc({productId: currentProduct._id, page, limit: 5}));
        }
    };

    const categorySlugParam = params["category-slug"];
    const productSlugParam = params["product-slug"];

    useEffect(() => {
        if (!currentProduct || !currentProduct?.category?.slug || !currentProduct.slug || !paramsArticle) return;
        if (!categorySlugParam || !productSlugParam) return;

        const shouldRedirect =
            categorySlugParam !== currentProduct.category.slug ||
            productSlugParam !== currentProduct.slug;

        if (shouldRedirect) {
            navigate(`/catalog/${currentProduct.category.slug}/${currentProduct.slug}/${paramsArticle}`, {replace: true});
        }
    }, [
        currentProduct?.slug,
        currentProduct?.category?.slug,
        paramsArticle,
        categorySlugParam,
        productSlugParam,
        navigate
    ]);

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
    }, [currentProduct]);

    if (isLoadingProduct) return <p className="main__container">Загрузка...</p>;
    if (!currentProduct) return <p className="main__container">Товар не найден</p>;

    const variant = currentProduct.variants.find((v) => v.article === paramsArticle);
    if (!variant) return <p className="main__container">Вариант не найден</p>;

    const calcDiscountPrice = (price: number, discount: number) =>
        discount > 0 ? Math.round(price - (price * discount) / 100) : price;

    const handleCreateReview = async (data: { rating: number; text: string }) => {
        if (!currentProduct?._id) return;

        const result = await dispatch(createCommentFunc({
            product: currentProduct._id,
            text: data.text,
            rating: data.rating
        }));

        if (createCommentFunc.rejected.match(result)) {
            const errorPayload = result.payload as any;
            const error = new Error(errorPayload?.message || "Ошибка при создании комментария");
            (error as any).payload = errorPayload;
            throw error;
        }

        dispatch(getProductFunc(paramsArticle));
        dispatch(getProductCommentsFunc({productId: currentProduct._id, page: currentPage, limit: 5}));
        setIsReviewModalOpen(false);
    };

    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: `/catalog`, label: "Каталог"},
        {path: `/catalog/${currentProduct.category?.slug}`, label: currentProduct.category.title},
        {
            path: `/catalog/${currentProduct.category?.slug}/${currentProduct.slug}/${paramsArticle}`,
            label: currentProduct.title
        },
    ];

    // SEO данные
    const seoTitle = currentProduct.seo?.metaTitle || currentProduct.title;
    const seoDescription = currentProduct.seo?.metaDescription || currentProduct.description || `Купить ${currentProduct.title} в интернет-магазине Shispare. ${currentProduct.description || "Качественные строительные материалы с доставкой по России."}`;
    const seoKeywords = currentProduct.seo?.metaKeywords || `${currentProduct.title}, строительные материалы, ${currentProduct.category?.title || ""}`;
    const seoImage = currentProduct.seo?.ogImage || currentProduct.images[0] || "/logo.png";
    const seoUrl = `/catalog/${currentProduct.category?.slug}/${currentProduct.slug}/${paramsArticle}`;

    return (
        <>
            <SEO
                title={seoTitle}
                description={seoDescription}
                keywords={seoKeywords}
                image={seoImage}
                url={seoUrl}
                type="product"
                canonical={seoUrl}
            />
            <div className="main__container">
                <Breadcrumbs items={breadcrumbsItems} isLoading={isLoadingProduct}/>

                <div className={`main__block ${styles.oneProduct}`}>
                    <div className={`${styles.productImagesBlock} flex gap-10`}>
                        <div className={styles.imagesBlock}>
                            {currentProduct.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt=""
                                    onClick={() => setCurImage(image)}
                                    className={curImage === image ? styles.activeThumb : ""}
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

                            <p className="font-roboto">{currentProduct.description}</p>
                            <p className="mt-10">Цвет: {variant.color.ru}</p>
                            <p>
                                Упаковка: {variant.package.count} {variant.package.unit} ({variant.package.type})
                            </p>
                            <p>В наличии: {variant.countInStock} шт.</p>
                            <p>Страна производства: {currentProduct.country}</p>
                            <p>Срок хранения: {12} мес.</p>

                            {currentProduct.variants.length > 1 && (
                                <>
                                    <p className="mt-10 mb-10">Варианты товара:</p>
                                    <div className={styles.variantsScrollContainer}>
                                        <div className={styles.variantsScroll}>
                                            {currentProduct.variants
                                                .map(v => (
                                                    <Link
                                                        key={v.article}
                                                        to={`/catalog/${currentProduct.category?.slug}/${currentProduct.slug}/${v.article}`}
                                                        className={styles.variantCard}
                                                    >
                                                        <div className={styles.variantInfo}>
                                                            {v.color?.ru && (
                                                                <span
                                                                    className={styles.variantColorName}>{v.color.ru}</span>
                                                            )}
                                                            <span className={styles.variantUnit}>{v.package.unit}</span>
                                                            <span
                                                                className={styles.variantCount}>{v.package.count}</span>
                                                            <span
                                                                className={styles.variantPackageType}>{v.package.type}</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="mt-15 flex gap-10 align-items-center">
                                <QuantityButtons product={currentProduct} article={variant.article}/>
                                <Link to={`/calculator/${variant.article}`}>
                                    <Button className={styles.calculatorButton}>
                                        <FaCalculator/> Калькулятор
                                    </Button>
                                </Link>
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

                        {currentProduct.documents && currentProduct.documents.length > 0 && (
                            <div className={`${styles.oneProductInfoBlock} p-20 mt-20`}>
                                <p className="fz-18 mb-10">Документы</p>
                                <div className={styles.documentsList}>
                                    {currentProduct.documents.map((doc, index) => (
                                        <a
                                            key={index}
                                            href={doc}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.documentLink}
                                        >
                                            <FaFileDownload/>
                                            <span>Документ {index + 1}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="main__block mt-20">
                    <div className="flex gap-30 align-items-center">
                        <h1 className="title">Отзывы</h1>
                        <StarRating
                            rating={currentProduct.displayedRating}
                            totalComments={currentProduct.totalComments}
                        />
                        {isAuthenticated && (
                            isLoadingCanComment ? (
                                <p className="color-gray">Проверка...</p>
                            ) : canComment === true ? (
                                <Button
                                    onClick={() => setIsReviewModalOpen(true)}
                                    className={styles.addReviewButton}
                                >
                                    Оставить отзыв
                                </Button>
                            ) : canComment === false && canCommentReason ? (
                                <p className="color-gray fz-14" style={{maxWidth: "300px"}}>
                                    {canCommentReason}
                                </p>
                            ) : null
                        )}
                    </div>

                    {isLoadingComments ? (
                        <p className="text-center color-gray mt-20">Загрузка отзывов...</p>
                    ) : comments && comments.length > 0 ? (
                        <>
                            <div className={styles.commentsList}>
                                {comments.map((comment) => (
                                    <CommentCard key={comment._id} comment={comment}/>
                                ))}
                            </div>
                            {pagination && (
                                <Pagination
                                    pagination={pagination}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    ) : (
                        <h1 className="title center color-gray mt-20">Нет отзывов</h1>
                    )}
                </div>

                <Modal modal={isReviewModalOpen} setModal={setIsReviewModalOpen}>
                    {currentProduct?._id && (
                        <CreateReviewForm
                            productId={currentProduct._id}
                            onSubmit={handleCreateReview}
                            onCancel={() => setIsReviewModalOpen(false)}
                            isLoading={isLoadingActionComment}
                        />
                    )}
                </Modal>
                <div className="main__block">
                    <SeenStory/>
                </div>
            </div>
        </>
    );
};