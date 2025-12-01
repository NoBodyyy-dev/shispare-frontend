import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook";
import {getProductsByCategoryFunc} from "../../store/actions/product.action";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs";
import {Product} from "../../lib/products/Product";
import SkeletonProductCard from "../../lib/skeletons/ProductSkeleton";
import {Modal} from "../../lib/modal/Modal.tsx";
import {CreateCategoryForm} from "./CreateCategoryForm.tsx";
import {TitleWithCreateButton} from "../../lib/title/TitleWithCreateButton.tsx";

export const Products = () => {
    const dispatch = useAppDispatch();
    const {products, isLoadingProducts, curCategory} = useAppSelector(
        (state) => state.product
    );
    const params = useParams();

    const [openModal, setOpenModal] = useState(false);

    const categorySlug = params["category-slug"];

    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: "/catalog", label: "Каталог"},
        {
            path: `/catalog/${categorySlug}`!,
            label: curCategory,
        },
    ];

    useEffect(() => {
        if (categorySlug && categorySlug !== "undefined") {
            dispatch(getProductsByCategoryFunc({slug: categorySlug}));
        }
    }, [dispatch, categorySlug]);

    const variantEntries = useMemo(() => {
        if (!Array.isArray(products)) return [];
        return products.flatMap((product) =>
            (product.variants || []).map((variant) => ({
                product,
                variant,
            }))
        );
    }, [products]);

    return (
        <div className="main__container products">
            <Breadcrumbs items={breadcrumbsItems} isLoading={isLoadingProducts}/>
            <TitleWithCreateButton title={curCategory} openModal={setOpenModal}/>
            <div className="products__container">
                {isLoadingProducts
                    ? [...Array(8)].map((_, index) => <SkeletonProductCard key={index}/>)
                    : variantEntries.length > 0
                        ? variantEntries.map(({product, variant}) => {
                            return (
                                <Product
                                    key={`${product._id}-${variant.article}`}
                                    productData={product}
                                    variantArticle={variant.article}
                                />
                            );
                        })
                        : <div className="empty-state">Товары не найдены</div>}
            </div>
            {
                openModal
                && <Modal modal={openModal} setModal={setOpenModal}>
                    <CreateCategoryForm/>
                </Modal>
            }
        </div>
    );
}
