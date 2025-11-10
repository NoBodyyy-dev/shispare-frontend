import React, { useEffect, useState, ChangeEvent } from "react";
import {
    getProductsByCategoryFunc,
    createProductFunc,
    updateProductFunc,
    deleteProductFunc,
} from "../../store/actions/product.action";
import { getAllCategoriesFunc } from "../../store/actions/category.action";
import { ProductTable } from "./ProductTable";
import { useAppDispatch, useAppSelector } from "../../hooks/state.hook";
import styles from "./admin.module.sass";
import { Modal } from "../../lib/modal/Modal";
import { MainInput } from "../../lib/input/MainInput";
import { MainTextarea } from "../../lib/input/MainTextarea";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../store/api";

export const AdminProductsAccordionPage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { categories } = useAppSelector((state) => state.category);

    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [categoryProducts, setCategoryProducts] = useState<Record<string, any[]>>({});
    const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadResponse, setUploadResponse] = useState<any>(null);

    const [formData, setFormData] = useState<any>({
        title: "",
        description: "",
        categorySlug: "",
        categoryTitle: "",
        price: "",
        country: "",
        countInStock: "",
        discount: "",
        article: "",
        package: "",
    });
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    useEffect(() => {
        if (!isAuthenticated || user?.role === "User") navigate("/");
    }, [isAuthenticated, user]);

    useEffect(() => {
        dispatch(getAllCategoriesFunc());
    }, [dispatch]);

    // ─────────────────────────────
    // 📦 Excel upload
    // ─────────────────────────────
    const handleExcelUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadResponse(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await api.post("/parse/test", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUploadResponse(res.data);
            alert("✅ Файл успешно отправлен на парсинг");
        } catch (err: any) {
            console.error(err);
            alert("Ошибка при отправке файла");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    // ─────────────────────────────
    // 📂 Toggle category
    // ─────────────────────────────
    const toggleCategory = async (slug: string) => {
        if (activeCategory === slug) {
            setActiveCategory(null);
            return;
        }

        setActiveCategory(slug);

        if (!categoryProducts[slug]) {
            try {
                setLoadingCategory(slug);
                const result = await dispatch(getProductsByCategoryFunc(slug)).unwrap();
                console.log("📦 Ответ API:", result);

                // ✅ сервер возвращает { success: true, products: { products: [...] } }
                let productsArray: any[] = [];

                if (Array.isArray(result)) {
                    productsArray = result;
                } else if (result?.products?.products) {
                    productsArray = result.products.products;
                } else if (result?.products) {
                    productsArray = result.products;
                }

                console.log("✅ Массив товаров:", productsArray);

                setCategoryProducts((prev) => ({
                    ...prev,
                    [slug]: productsArray,
                }));
            } catch (err) {
                console.error("Ошибка при загрузке товаров:", err);
            } finally {
                setLoadingCategory(null);
            }
        }
    };

    // ─────────────────────────────
    // ➕ Modal create product
    // ─────────────────────────────
    const handleOpenModal = (catSlug: string, catTitle: string) => {
        setFormData({
            title: "",
            description: "",
            categorySlug: catSlug,
            categoryTitle: catTitle,
            price: "",
            country: "",
            countInStock: "",
            discount: "",
            article: "",
            package: "",
        });
        setOpenModal(true);
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await dispatch(createProductFunc(formData)).unwrap();
            setCategoryProducts((prev) => ({
                ...prev,
                [formData.categorySlug]: [
                    ...(prev[formData.categorySlug] || []),
                    result,
                ],
            }));
            setOpenModal(false);
        } catch (err) {
            console.error(err);
            alert("Ошибка при создании товара");
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        try {
            const payload: any = {
                productID: editingProduct._id,
                title: formData.title,
                description: formData.description,
                country: formData.country,
                isActive: formData.isActive,
                // update first variant basic fields
                variants: [
                    {
                        article: formData.article,
                        price: formData.price,
                        discount: formData.discount,
                        countInStock: formData.countInStock,
                        package: { type: formData.package },
                    },
                ],
            };

            const result = await dispatch(updateProductFunc(payload)).unwrap();

            // replace product in local categoryProducts
            setCategoryProducts((prev) => {
                const catSlug = editingProduct.category?.slug || formData.categorySlug;
                const arr = prev[catSlug] || [];
                return {
                    ...prev,
                    [catSlug]: arr.map((p) => (p._id === result._id ? result : p)),
                };
            });

            setOpenEditModal(false);
            setEditingProduct(null);
        } catch (err) {
            console.error(err);
            alert('Ошибка при обновлении товара');
        }
    };

    return (
        <div className="main__container">
            <div className="flex align-center justify-between mb-20">
                <h1 className="title">Управление товарами</h1>

                <label
                    htmlFor="excel-upload"
                    className={styles.uploadBtn}
                    style={{
                        background: uploading ? "#ccc" : "#4A90E2",
                        color: "#fff",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        cursor: uploading ? "not-allowed" : "pointer",
                        transition: "0.2s",
                    }}
                >
                    {uploading ? "Загрузка..." : "📁 Импорт Excel"}
                </label>
                <input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleExcelUpload}
                    style={{ display: "none" }}
                />
            </div>

            <div className={styles.accordion}>
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.slug;
                    const productsForCat = categoryProducts[cat.slug] || [];
                    const isLoading = loadingCategory === cat.slug;

                    return (
                        <div
                            key={cat.slug}
                            className={`${styles.item} ${isActive ? styles.active : ""}`}
                        >
                            <div className={styles.header}>
                                <div
                                    className={styles.headerLeft}
                                    onClick={() => toggleCategory(cat.slug)}
                                >
                                    <span>{cat.title}</span>
                                    <span className={styles.count}>
                                        {productsForCat.length > 0
                                            ? `${productsForCat.length} товаров`
                                            : ""}
                                    </span>
                                    <span className={styles.arrow}>
                                        {isActive ? "▲" : "▼"}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleOpenModal(cat.slug, cat.title)}
                                    className={styles.addBtn}
                                >
                                    +
                                </button>
                            </div>

                            {isActive && (
                                <div className={styles.body}>
                                    {isLoading ? (
                                        <p className={styles.loading}>Загрузка товаров...</p>
                                    ) : (
                                        <ProductTable
                                            products={productsForCat}
                                            onEdit={(p) => {
                                                // open edit modal
                                                setEditingProduct(p);
                                                setOpenEditModal(true);
                                                setFormData({
                                                    title: p.title || "",
                                                    description: p.description || "",
                                                    categorySlug: p.category?.slug || cat.slug,
                                                    categoryTitle: p.category?.title || cat.title,
                                                    price: p.variants?.[0]?.price || "",
                                                    country: p.country || "",
                                                    countInStock: p.variants?.[0]?.countInStock || "",
                                                    discount: p.variants?.[0]?.discount || "",
                                                    article: p.variants?.[0]?.article || "",
                                                    package: p.variants?.[0]?.package?.type || "",
                                                    isActive: p.isActive,
                                                });
                                            }}
                                            onDelete={async (id) => {
                                                if (!confirm('Удалить товар?')) return;
                                                try {
                                                    await dispatch(deleteProductFunc(id)).unwrap();
                                                    setCategoryProducts((prev) => ({
                                                        ...prev,
                                                        [cat.slug]: (prev[cat.slug] || []).filter((pp) => pp._id !== id),
                                                    }));
                                                } catch (err) {
                                                    console.error(err);
                                                    alert('Ошибка при удалении товара');
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ─────────────── МОДАЛКА ─────────────── */}
            <Modal modal={openModal} setModal={setOpenModal}>
                <form onSubmit={handleCreateProduct} className="flex-col">
                    <h2>Добавить товар ({formData.categoryTitle})</h2>

                    <label>Название</label>
                    <MainInput
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        required
                    />

                    <label>Описание</label>
                    <MainTextarea
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                    />

                    <label>Цена (₽)</label>
                    <MainInput
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                price: Number(e.target.value),
                            })
                        }
                        required
                    />

                    <label>Количество на складе</label>
                    <MainInput
                        type="number"
                        value={formData.countInStock}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                countInStock: Number(e.target.value),
                            })
                        }
                    />

                    <label>Скидка (%)</label>
                    <MainInput
                        type="number"
                        value={formData.discount}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                discount: Number(e.target.value),
                            })
                        }
                    />

                    <label>Артикул</label>
                    <MainInput
                        value={formData.article}
                        onChange={(e) =>
                            setFormData({ ...formData, article: e.target.value })
                        }
                    />

                    <label>Страна</label>
                    <MainInput
                        value={formData.country}
                        onChange={(e) =>
                            setFormData({ ...formData, country: e.target.value })
                        }
                    />

                    <label>Тип упаковки</label>к
                    <MainInput
                        value={formData.package}
                        onChange={(e) =>
                            setFormData({ ...formData, package: e.target.value })
                        }
                    />

                    <button type="submit" className={styles.submitBtn}>
                        💾 Создать
                    </button>
                </form>
            </Modal>

            {/* ─────────────── РЕДАКТИРОВАНИЕ ТОВАРА ─────────────── */}
            <Modal modal={openEditModal} setModal={setOpenEditModal}>
                <form onSubmit={handleUpdateProduct} className="flex-col">
                    <h2>Редактировать товар ({formData.categoryTitle})</h2>

                    <label>Название</label>
                    <MainInput
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <label>Описание</label>
                    <MainTextarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <label>Цена (₽)</label>
                    <MainInput
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        required
                    />

                    <label>Количество на складе</label>
                    <MainInput
                        type="number"
                        value={formData.countInStock}
                        onChange={(e) => setFormData({ ...formData, countInStock: Number(e.target.value) })}
                    />

                    <label>Скидка (%)</label>
                    <MainInput
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    />

                    <label>Артикул</label>
                    <MainInput
                        value={formData.article}
                        onChange={(e) => setFormData({ ...formData, article: e.target.value })}
                    />

                    <label>Страна</label>
                    <MainInput value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />

                    <label>Тип упаковки</label>
                    <MainInput value={formData.package} onChange={(e) => setFormData({ ...formData, package: e.target.value })} />

                    <label>
                        <input
                            type="checkbox"
                            checked={!!formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        />{' '}
                        Активен
                    </label>

                    <button type="submit" className={styles.submitBtn}>
                        💾 Сохранить
                    </button>
                </form>
            </Modal>

            {uploadResponse && (
                <div className="mt-20">
                    <h3>Результат импорта:</h3>
                    <pre
                        style={{
                            background: "#f6f8fa",
                            padding: "10px",
                            borderRadius: "6px",
                            marginTop: "10px",
                            maxHeight: "300px",
                            overflow: "auto",
                        }}
                    >?
                        {JSON.stringify(uploadResponse, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};