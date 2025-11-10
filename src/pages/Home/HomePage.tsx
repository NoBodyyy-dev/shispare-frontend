import {FC, useEffect} from "react";
import {getPopularProductsFunc, getProductsWithDiscountFunc} from "../../store/actions/product.action.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {Product} from "../../lib/products/Product.tsx";
import SkeletonProductCard from "../../lib/skeletons/ProductSkeleton.tsx";
import StockSwiper from "./StockSwiper.tsx";
import MainMap from "../../lib/Map/Map.tsx";
import {Feedback} from "./Feedback.tsx";
import {BlogContainer} from "./BlogContainer.tsx";


export const Home: FC = () => {
    const dispatch = useAppDispatch();
    const {
        isLoadingPopularProducts,
        isLoadingDiscountProducts,
        popularProducts,
        discountProducts,
    } = useAppSelector((state) => state.product);

    useEffect(() => {
        if (!popularProducts.length) {
            dispatch(getPopularProductsFunc());
            dispatch(getProductsWithDiscountFunc());
        }
    }, [dispatch]);

    return (
        <div className="main__container home">
            <div className="home__container">
                <div className="main__block home__block stock">
                    <StockSwiper/>
                </div>

                <div className="main__block home__block">
                    <h1 className="title mb-25">Товары по скидке</h1>
                    <div className="products__container">
                        {isLoadingDiscountProducts ? (
                            [...Array(4)].map((_, index) => {
                                return <SkeletonProductCard key={`skeleton-${index}`}/>;
                            })
                        ) : discountProducts.length ? (
                            discountProducts.map((product) => {
                                return <Product key={product._id} productData={product}/>;
                            })
                        ) : (
                            <h1 className="title">Нет товаров со скидками</h1>
                        )}
                    </div>
                </div>
                <div className="main__block home__block">
                    <h1 className="title mb-25">Популярное</h1>
                    <div className="home__products products__container">
                        {isLoadingPopularProducts
                            ? [...Array(4)].map((_, index) => {
                                return <SkeletonProductCard key={`skel-prod-${index}`}/>;
                            })
                            : popularProducts.map((product) => {
                                return <Product key={product._id} productData={product}/>;
                            })}
                    </div>
                </div>
                <BlogContainer/>
                <div className="main__block home__block">
                    <h1 className="title mb-25">Адрес</h1>
                    <MainMap geomX={38.859358} geomY={45.047813} showInfo={true}/>
                </div>
                <div className="main__block home__block">
                    <h1 className="title mb-25">Есть вопросы? Оставьте заявку</h1>
                    <Feedback/>
                </div>
            </div>
        </div>
    );
}
