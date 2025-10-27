import React from "react";
import styles from "./admin.module.sass";
import { ProductInterface } from "../../store/interfaces/product.interface";

interface ProductTableProps {
    products: ProductInterface[];
    onEdit?: (product: ProductInterface) => void;
    onDelete?: (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
                                                              products,
                                                              onEdit,
                                                              onDelete,
                                                          }) => {
    if (!products?.length) {
        return <p className={styles.empty}>Нет товаров в этой категории</p>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Артикул</th>
                    <th>Цвет</th>
                    <th>Цена (₽)</th>
                    <th>Скидка (%)</th>
                    <th>Остаток</th>
                    <th>Тип упаковки</th>
                    <th>Кол-во</th>
                    <th>Ед.</th>
                    <th>Страна</th>
                    <th>Категория</th>
                    <th>Рейтинг</th>
                    <th>Отзывы</th>
                    <th>Покупки</th>
                    <th>Активен</th>
                    <th>Создан</th>
                    <th className={styles.actionsCol}>Действия</th>
                </tr>
                </thead>

                <tbody>
                {products.flatMap((p) =>
                    p.variants.map((v) => (
                        <tr key={`${p._id}-${v.article}`}>
                            <td>{p.title}</td>
                            <td>{v.article}</td>
                            <td>{v.color?.ru || "—"}</td>
                            <td>{v.price?.toFixed(2) || "—"}</td>
                            <td>{v.discount || 0}</td>
                            <td>{v.countInStock || 0}</td>
                            <td>{v.package?.type || "—"}</td>
                            <td>{v.package?.count || "—"}</td>
                            <td>{v.package?.unit || "—"}</td>
                            <td>{p.country || "—"}</td>
                            <td>{p.category?.title || "—"}</td>
                            <td>{p.displayedRating?.toFixed(1) || "0.0"}</td>
                            <td>{p.totalComments || 0}</td>
                            <td>{p.totalPurchases || 0}</td>
                            <td>{p.isActive ? "✅" : "❌"}</td>
                            <td>
                                {p.createdAt
                                    ? new Date(p.createdAt).toLocaleDateString()
                                    : "—"}
                            </td>
                            <td className={styles.actions}>
                                <button
                                    className={styles.edit}
                                    onClick={() => onEdit && onEdit(p)}
                                >
                                    ✏️
                                </button>
                                <button
                                    className={styles.delete}
                                    onClick={() => onDelete && onDelete(p._id)}
                                >
                                    🗑
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};