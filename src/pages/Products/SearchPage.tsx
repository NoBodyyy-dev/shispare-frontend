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
        <div className="main__container">
            <h2 className="title mb-20">Результаты поиска: "{query}"</h2>

            {loading && <p>Загрузка...</p>}

            {!loading && products.length === 0 && (
                <p className={styles.noResults}>Ничего не найдено</p>
            )}

            <div className={styles.searchContainer}>
                {products.map((product) => (
                    <Product key={product._id} productData={product}/>
                ))}
            </div>
        </div>
    );
};