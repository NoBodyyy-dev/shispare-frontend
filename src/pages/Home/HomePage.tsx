import {FC, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {motion, useInView, useReducedMotion} from "framer-motion";
import {getPopularProductsFunc, getProductsByBestRatingFunc} from "../../store/actions/product.action.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {Product} from "../../lib/products/Product.tsx";
import SkeletonProductCard from "../../lib/skeletons/ProductSkeleton.tsx";
import StockSwiper from "./StockSwiper.tsx";
import MainMap from "../../lib/Map/Map.tsx";
import {Feedback} from "./Feedback.tsx";
import {BlogContainer} from "./BlogContainer.tsx";
import {SEO} from "../../lib/seo/SEO.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import {FaCalculator} from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './home.sass';


export const Home: FC = () => {
    const dispatch = useAppDispatch();
    const prefersReducedMotion = useReducedMotion();
    const {
        isLoadingPopularProducts,
        isLoadingBestRatingProducts,
        popularProducts,
        bestRatingProducts,
    } = useAppSelector((state) => state.product);

    const stockRef = useRef(null);
    const popularRef = useRef(null);
    const ratingRef = useRef(null);
    const calculatorRef = useRef(null);
    const blogRef = useRef(null);
    const mapRef = useRef(null);
    const feedbackRef = useRef(null);

    const stockInView = useInView(stockRef, {once: true, margin: "-100px"});
    const popularInView = useInView(popularRef, {once: true, margin: "-100px"});
    const ratingInView = useInView(ratingRef, {once: true, margin: "-100px"});
    const calculatorInView = useInView(calculatorRef, {once: true, margin: "-100px"});
    const blogInView = useInView(blogRef, {once: true, margin: "-100px"});
    const mapInView = useInView(mapRef, {once: true, margin: "-100px"});
    const feedbackInView = useInView(feedbackRef, {once: true, margin: "-100px"});

    useEffect(() => {
        dispatch(getPopularProductsFunc(6));
        dispatch(getProductsByBestRatingFunc(6));
    }, [dispatch]);

    const fadeInUp = {
        hidden: {
            opacity: prefersReducedMotion ? 1 : 0,
            y: prefersReducedMotion ? 0 : 50,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1] as const,
            },
        },
    };

    return (
        <>
            <SEO
                title="Главная"
                description="Широкий ассортимент строительных материалов от ведущих производителей. Качественные товары для строительства и ремонта с доставкой по России."
                keywords="строительные материалы, материалы для ремонта, интернет-магазин строительных материалов, доставка по России"
                url="/"
                type="website"
            />
            <div className="home__hero">
                <div className="home__hero-background"></div>
                <div className="main__container">
                    <div className="home__hero-content">
                        <h1 className="home__hero-title">
                            <span className="home__hero-accent">Шиспар</span> — официальный поставщик Sika
                        </h1>
                        <div className="home__hero-info">
                            <p className="home__hero-description">
                                Sika — швейцарская компания с более чем 100-летней историей, мировой лидер в
                                производстве
                                строительных материалов. Специализируется на гидроизоляции, герметизации, укреплении
                                бетона и ремонтных смесях для профессионального строительства.
                            </p>
                        </div>
                        <Link to="/solution">
                            <Button className="home__hero-btn">
                                Смотреть решения
                            </Button>
                        </Link>
                        <div className="home__hero-highlights">
                            {[
                                {title: "Решения для дома", text: "Комплексные комплекты под любые задачи"},
                                {title: "Экспертная поддержка", text: "Подбор материалов и консультации"},
                                {title: "Швейцарское качество", text: "Сертифицированная продукция Sika"}
                            ].map((item) => (
                                <div className="home__highlight-card" key={item.title}>
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="main__container home">
                <div className="home__container">
                    <motion.div
                        ref={stockRef}
                        initial="hidden"
                        animate={stockInView ? "visible" : "hidden"}
                        variants={fadeInUp}
                        className="home__section stock"
                    >
                        <StockSwiper/>
                    </motion.div>

                    <motion.div
                        ref={popularRef}
                        initial="hidden"
                        animate={popularInView ? "visible" : "hidden"}
                        variants={fadeInUp}
                        className="home__section"
                    >
                        <h1 className="title mb-25">Самые популярные</h1>
                        {isLoadingPopularProducts ? (
                            <div className="products__container">
                                {[...Array(6)].map((_, index) => {
                                    return <SkeletonProductCard key={`skeleton-popular-${index}`}/>;
                                })}
                            </div>
                        ) : popularProducts.length > 0 ? (
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={20}
                                slidesPerView={4}
                                navigation
                                breakpoints={{
                                    320: {slidesPerView: 1},
                                    640: {slidesPerView: 2},
                                    968: {slidesPerView: 3},
                                    1200: {slidesPerView: 4},
                                }}
                                className="home__products-swiper"
                            >
                                {popularProducts.map((product) => (
                                    <SwiperSlide key={product._id}>
                                        <Product productData={product}/>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <p className="text-center color-gray">Популярные товары не найдены</p>
                        )}
                    </motion.div>

                    {/* Товары с лучшим рейтингом */}
                    <motion.div
                        ref={ratingRef}
                        initial="hidden"
                        animate={ratingInView ? "visible" : "hidden"}
                        variants={fadeInUp}
                        className="home__section"
                    >
                        <h1 className="title mb-25">Самый высокий рейтинг</h1>
                        {isLoadingBestRatingProducts ? (
                            <div className="products__container">
                                {[...Array(6)].map((_, index) => {
                                    return <SkeletonProductCard key={`skeleton-rating-${index}`}/>;
                                })}
                            </div>
                        ) : bestRatingProducts.length > 0 ? (
                            <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={20}
                                slidesPerView={4}
                                navigation
                                pagination={{clickable: true}}
                                breakpoints={{
                                    320: {slidesPerView: 1},
                                    640: {slidesPerView: 2},
                                    968: {slidesPerView: 3},
                                    1200: {slidesPerView: 4},
                                }}
                                className="home__products-swiper"
                            >
                                {bestRatingProducts.map((product) => (
                                    <SwiperSlide key={product._id}>
                                        <Product productData={product}/>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <p className="text-center color-gray">Товары с высоким рейтингом не найдены</p>
                        )}
                    </motion.div>
                </div>
            </div>
            <div className="home__hero">
                <motion.div
                    ref={calculatorRef}
                    initial="hidden"
                    animate={calculatorInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                    className="home__calculator-cta"
                >
                    <div className="home__calculator-content">
                        <h2 className="home__calculator-title">
                            Не знаете, сколько вам нужно материала и боитесь переплатить?
                        </h2>
                        <p className="home__calculator-text">
                            Воспользуйтесь калькулятором для точного расчета необходимого количества материалов
                        </p>
                        <Link to="/calculator">
                            <Button className="home__calculator-btn">
                                <FaCalculator/> Рассчитать
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
            <div className="main__container">
                <motion.div
                    ref={blogRef}
                    initial="hidden"
                    animate={blogInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                >
                    <BlogContainer/>
                </motion.div>

                <motion.div
                    ref={mapRef}
                    initial="hidden"
                    animate={mapInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                    className="home__section"
                >
                    <h1 className="title mb-25">Адрес</h1>
                    <MainMap geomX={38.859358} geomY={45.047813} showInfo={true}/>
                </motion.div>

                <motion.div
                    ref={feedbackRef}
                    initial="hidden"
                    animate={feedbackInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                    className="home__section"
                >
                    <h1 className="title mb-25">Есть вопросы? Оставьте заявку</h1>
                    <Feedback/>
                </motion.div>
            </div>
        </>
    );
}
