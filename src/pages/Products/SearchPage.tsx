import {FC, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import api from "../../store/api.ts";
import styles from "./product.page.module.sass";
import {Product} from "../../lib/products/Product.tsx";
import {ProductInterface} from "../../store/interfaces/product.interface.ts";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {SEO} from "../../lib/seo/SEO.tsx";

export const SearchPage: FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [loading, setLoading] = useState(false);

    const breadcrumbsItems = [
        {
            path: "/",
            label: "Главная"
        },
        {
            path: `/search${query ? `?q=${encodeURIComponent(query)}` : ""}`,
            label: "Поиск",
        },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            if (!query.trim()) {
                setProducts([]);
                return;
            }
            setLoading(true);
            try {
                const {data} = await api.get(`/product/search?q=${encodeURIComponent(query)}`);
                if (data.success && data.products) {
                    setProducts(data.products);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Ошибка поиска:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query]);

    return (
        <>
            <SEO
                title={query ? `Поиск: "${query}"` : "Поиск товаров"}
                description={query ? `Результаты поиска по запросу "${query}"` : "Поиск товаров в каталоге"}
                keywords={`поиск, ${query}`}
                url={`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`}
                type="website"
            />
            <div className="main__container">
                <Breadcrumbs items={breadcrumbsItems} isLoading={false}/>
                <div className={styles.searchPage}>
                    {query && (
                        <h1 className={styles.title}>
                            Результаты поиска: <span className={styles.queryText}>"{query}"</span>
                        </h1>
                    )}

                    {!query && (
                        <h1 className={styles.title}>Поиск товаров</h1>
                    )}

                    {loading && (
                        <div className={styles.loadingState}>
                            <p>Загрузка результатов...</p>
                        </div>
                    )}

                    {!loading && query && products.length === 0 && (
                        <div className={styles.noResults}>
                            <p>По запросу "{query}" ничего не найдено</p>
                            <p className={styles.noResultsHint}>Попробуйте изменить поисковый запрос или использовать другие ключевые слова</p>
                        </div>
                    )}

                    {!loading && !query && (
                        <div className={styles.noResults}>
                            <p>Введите поисковый запрос в поле поиска</p>
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <>
                            <p className={styles.resultsCount}>
                                Найдено товаров: <strong>{products.length}</strong>
                            </p>
                            <div className={styles.resultsGrid}>
                                {products.map((product) => (
                                    <Product key={product._id} productData={product}/>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};