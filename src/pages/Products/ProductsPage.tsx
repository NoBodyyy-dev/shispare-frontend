import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook";
import {getProductsByCategoryFunc} from "../../store/actions/product.action";
import Breadcrumbs from "../../lib/breadcrumbs/Breadcrumbs";
import Product from "../../lib/products/Product";
import SkeletonProductCard from "../../lib/skeletons/ProductSkeleton";

export default function Products() {
    const dispatch = useAppDispatch();
    const {products, isLoadingProducts, curCategory} = useAppSelector(
        (state) => state.product
    );
    const params = useParams();

    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: "/categories", label: "Категории"},
        {
            path: `/categories/${params["category-slug"]}`!,
            label: curCategory,
        },
    ];

    useEffect(() => {
        console.log(params["category-slug"]);
        dispatch(getProductsByCategoryFunc(params["category-slug"]!));
        console.log(products);
    }, [dispatch]);

    return (
        <div className="main__container products">
            <Breadcrumbs items={breadcrumbsItems} isLoading={isLoadingProducts} />
            <h1 className="title mb-25">{curCategory}</h1>
            <div className="products__container">
                {isLoadingProducts
                    ? [...Array(8)].map((_, index) => <SkeletonProductCard key={index}/>)
                    : products.map((product) => {
                        return <Product key={product._id} productData={product}/>;
                    })}
            </div>
        </div>
    );
}
