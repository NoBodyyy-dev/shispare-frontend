import {FC, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import api from "../../store/api.ts";
import styles from "./product.page.module.sass";
import {Product} from "../../lib/products/Product.tsx";
import {ProductInterface} from "../../store/interfaces/product.interface.ts";

export const SearchPage: FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!query.trim()) return;
            setLoading(true);
            try {
                const {data} = await api.get(`/api/products/search?q=${encodeURIComponent(query)}`);
                setProducts(data);
            } catch (error) {
                console.error("Ошибка поиска:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query]);

    return (
        <div className={styles.searchPage}>
            <h2 className={styles.title}>Результаты поиска: "{query}"</h2>

            {loading && <p>Загрузка...</p>}

            {!loading && products.length === 0 && (
                <p className={styles.noResults}>Ничего не найдено</p>
            )}

            <div className={styles.resultsGrid}>
                {products.map((product) => (
                    <Product key={product._id} productData={product}/>
                ))}
            </div>
        </div>
    );
};