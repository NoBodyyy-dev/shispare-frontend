import React, {useEffect, useState, ChangeEvent} from "react";
import {
    getProductsByCategoryFunc,
    createProductFunc,
    updateProductFunc,
    deleteProductFunc,
} from "../../store/actions/product.action";
import {getAllCategoriesFunc} from "../../store/actions/category.action";
import {ProductTable} from "./ProductTable";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook";
import styles from "./admin.module.sass";
import {Modal} from "../../lib/modal/Modal";
import {MainInput} from "../../lib/input/MainInput";
import {MainTextarea} from "../../lib/input/MainTextarea";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import api from "../../store/api";
import {Button} from "../../lib/buttons/Button.tsx";
import {TitleWithCreateButton} from "../../lib/title/TitleWithCreateButton.tsx";
import {ConfirmModal} from "../../lib/modal/ConfirmModal.tsx";
import {addMessage} from "../../store/slices/push.slice.ts";

export const AdminProductsAccordionPage: React.FC = () => {
    const {user, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {categories} = useAppSelector((state) => state.category);

    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [categoryProducts, setCategoryProducts] = useState<Record<string, any[]>>({});
    const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadResponse, setUploadResponse] = useState<any>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
    const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean; productId: string | null}>({isOpen: false, productId: null});
    const [isCreatingProduct, setIsCreatingProduct] = useState(false);
    const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);

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
        colorRu: "",
        colorHex: "#000000",
        packageType: "",
        packageCount: "",
        packageUnit: "",
        images: [] as File[],
    });
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    useEffect(() => {
        if (!isAuthenticated || user?.role === "User") navigate("/");
    }, [isAuthenticated, user]);

    useEffect(() => {
        dispatch(getAllCategoriesFunc());
    }, [dispatch]);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleExcelUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleExcelUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Проверка типа файла
        const validTypes = ['.xlsx', '.xls'];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        if (!validTypes.includes(fileExtension)) {
            dispatch(addMessage({text: "Пожалуйста, выберите файл Excel (.xlsx или .xls)", type: "error"}));
            e.target.value = "";
            return;
        }

        setUploading(true);
        setUploadResponse(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await api.post("/admin/parse/test", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });

            setUploadResponse(res.data);
            dispatch(addMessage({text: "Файл успешно отправлен на парсинг", type: "success"}));
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.message || "Ошибка при отправке файла";
            dispatch(addMessage({text: `Ошибка: ${errorMessage}`, type: "error"}));
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
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
                const result = await dispatch(getProductsByCategoryFunc({slug})).unwrap();
                console.log("📦 Ответ API:", result);

                const productsArray = Array.isArray(result)
                    ? result
                    : Array.isArray(result?.products)
                        ? result.products
                        : [];

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
            colorRu: "",
            colorHex: "#000000",
            packageType: "",
            packageCount: "",
            packageUnit: "",
            images: [],
        });
        setOpenModal(true);
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});
        setIsCreatingProduct(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description || "");
            formDataToSend.append("categorySlug", formData.categorySlug);
            formDataToSend.append("country", formData.country || "");
            formDataToSend.append("article", formData.article || "");
            formDataToSend.append("price", formData.price || "");
            formDataToSend.append("discount", formData.discount || "0");
            formDataToSend.append("countInStock", formData.countInStock || "0");
            formDataToSend.append("color", JSON.stringify({
                ru: formData.colorRu || "Без цвета",
                hex: formData.colorHex || "#000000"
            }));
            formDataToSend.append("package", JSON.stringify({
                type: formData.packageType || "шт",
                count: Number(formData.packageCount) || 1,
                unit: formData.packageUnit || "шт"
            }));

            if (formData.images && Array.isArray(formData.images)) {
                formData.images.forEach((file: File) => {
                    formDataToSend.append("images", file);
                });
            }

            const result = await dispatch(createProductFunc(formDataToSend));

            if (createProductFunc.rejected.match(result)) {
                const errorPayload = result.payload as any;
                const serverErrors: Record<string, string[]> = {};

                if (errorPayload?.errors && typeof errorPayload.errors === 'object') {
                    Object.keys(errorPayload.errors).forEach((field) => {
                        const fieldErrors = errorPayload.errors[field];
                        if (Array.isArray(fieldErrors)) {
                            serverErrors[field] = fieldErrors;
                        } else if (typeof fieldErrors === 'string') {
                            serverErrors[field] = [fieldErrors];
                        }
                    });
                } else if (errorPayload?.message) {
                    const message = errorPayload.message.toLowerCase();
                    if (message.includes('title') || message.includes('назван')) {
                        serverErrors.title = [errorPayload.message];
                    } else if (message.includes('price') || message.includes('цена')) {
                        serverErrors.price = [errorPayload.message];
                    } else {
                        serverErrors.title = [errorPayload.message];
                    }
                }

                setFormErrors(serverErrors);
                return;
            }

            if (createProductFunc.fulfilled.match(result)) {
                setCategoryProducts((prev) => ({
                    ...prev,
                    [formData.categorySlug]: [
                        ...(prev[formData.categorySlug] || []),
                        result.payload.product,
                    ],
                }));
                setOpenModal(false);
                setFormErrors({});
                setFormData({
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
                    colorRu: "",
                    colorHex: "#000000",
                    packageType: "",
                    packageCount: "",
                    packageUnit: "",
                    images: [],
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        setIsUpdatingProduct(true);
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
                        package: {type: formData.package},
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
            dispatch(addMessage({text: "Товар успешно обновлен", type: "success"}));
        } catch (err) {
            console.error(err);
            dispatch(addMessage({text: "Ошибка при обновлении товара", type: "error"}));
        } finally {
            setIsUpdatingProduct(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm.productId) return;
        
        const productId = deleteConfirm.productId;
        const product = Object.values(categoryProducts).flat().find(p => p._id === productId);
        const categorySlug = product?.category?.slug || Object.keys(categoryProducts).find(slug => 
            categoryProducts[slug]?.some(p => p._id === productId)
        );

        try {
            await dispatch(deleteProductFunc(productId)).unwrap();
            if (categorySlug) {
                setCategoryProducts((prev) => ({
                    ...prev,
                    [categorySlug]: (prev[categorySlug] || []).filter((pp) => pp._id !== productId),
                }));
            }
            dispatch(addMessage({text: "Товар успешно удален", type: "success"}));
        } catch (err) {
            console.error(err);
            dispatch(addMessage({text: "Ошибка при удалении товара", type: "error"}));
        } finally {
            setDeleteConfirm({isOpen: false, productId: null});
        }
    };

    return (
        <div className="main__container p-20">
            <TitleWithCreateButton
                title="Управление товарами"
                customButton={
                    <>
                        <Button
                            onClick={handleExcelUploadClick}
                            disabled={uploading}
                            className={styles.uploadBtn}
                        >
                            {uploading ? "Загрузка..." : "📁 Импорт Excel"}
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleExcelUpload}
                            style={{display: "none"}}
                        />
                    </>
                }
            />

            <div className={styles.accordion}>
                {categories && Array.isArray(categories) && categories.length > 0
                    ? categories.map((cat) => {
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
                                                        images: [] as File[], // Добавляем images для безопасности
                                                    });
                                                }}
                                                onDelete={(id) => {
                                                    setDeleteConfirm({isOpen: true, productId: id});
                                                }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                    : <p className="text-center color-gray">Категории не найдены</p>
                }
            </div>

            <Modal modal={openModal} setModal={setOpenModal}>
                <form onSubmit={handleCreateProduct} className="flex-col" onReset={() => setFormErrors({})}>
                    <h2>Добавить товар ({formData.categoryTitle})</h2>

                    <label>Название</label>
                    <MainInput
                        value={formData.title}
                        onChange={(e) => {
                            setFormData({...formData, title: e.target.value});
                            if (formErrors.title) {
                                setFormErrors(prev => {
                                    const newErrors = {...prev};
                                    delete newErrors.title;
                                    return newErrors;
                                });
                            }
                        }}
                        error={formErrors.title}
                        required
                    />

                    <label>Описание</label>
                    <MainTextarea
                        value={formData.description}
                        onChange={(e) => {
                            setFormData({...formData, description: e.target.value});
                            if (formErrors.description) {
                                setFormErrors(prev => {
                                    const newErrors = {...prev};
                                    delete newErrors.description;
                                    return newErrors;
                                });
                            }
                        }}
                    />
                    {formErrors.description && (
                        <div className="error-text" style={{marginTop: '4px'}}>
                            {formErrors.description.map((err, i) => (
                                <div key={i}>{err}</div>
                            ))}
                        </div>
                    )}

                    <label>Цена (₽)</label>
                    <MainInput
                        type="number"
                        value={formData.price}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                price: Number(e.target.value),
                            });
                            if (formErrors.price) {
                                setFormErrors(prev => {
                                    const newErrors = {...prev};
                                    delete newErrors.price;
                                    return newErrors;
                                });
                            }
                        }}
                        error={formErrors.price}
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
                        onChange={(e) => {
                            setFormData({...formData, article: e.target.value});
                            if (formErrors.article) {
                                setFormErrors(prev => {
                                    const newErrors = {...prev};
                                    delete newErrors.article;
                                    return newErrors;
                                });
                            }
                        }}
                        error={formErrors.article}
                    />

                    <label>Страна</label>
                    <MainInput
                        value={formData.country}
                        onChange={(e) =>
                            setFormData({...formData, country: e.target.value})
                        }
                    />

                    <label>Цвет (название)</label>
                    <MainInput
                        value={formData.colorRu}
                        onChange={(e) =>
                            setFormData({...formData, colorRu: e.target.value})
                        }
                        placeholder="Например: Красный"
                    />

                    <label>Цвет (HEX)</label>
                    <MainInput
                        type="color"
                        value={formData.colorHex}
                        onChange={(e) =>
                            setFormData({...formData, colorHex: e.target.value})
                        }
                    />

                    <label>Тип упаковки</label>
                    <MainInput
                        value={formData.packageType}
                        onChange={(e) =>
                            setFormData({...formData, packageType: e.target.value})
                        }
                        placeholder="Например: мешок, ведро"
                    />

                    <label>Количество/Объем</label>
                    <MainInput
                        type="number"
                        value={formData.packageCount}
                        onChange={(e) =>
                            setFormData({...formData, packageCount: e.target.value})
                        }
                        placeholder="Например: 25"
                    />

                    <label>Единица измерения</label>
                    <MainInput
                        value={formData.packageUnit}
                        onChange={(e) =>
                            setFormData({...formData, packageUnit: e.target.value})
                        }
                        placeholder="Например: кг, л, шт"
                    />

                    <label>Изображения</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setFormData({...formData, images: files});
                        }}
                        className={styles.fileInput}
                    />
                    {formData.images && formData.images.length > 0 && (
                        <div style={{marginTop: "10px", fontSize: "14px", color: "#666"}}>
                            Выбрано файлов: {formData.images.length}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        className="full-width mt-10"
                        loading={isCreatingProduct}
                        disabled={isCreatingProduct}
                    >
                        Создать
                    </Button>
                </form>
            </Modal>

            {/* ─────────────── РЕДАКТИРОВАНИЕ ТОВАРА ─────────────── */}
            <Modal modal={openEditModal} setModal={setOpenEditModal}>
                <form onSubmit={handleUpdateProduct} className="flex-col">
                    <h2>Редактировать товар ({formData.categoryTitle})</h2>

                    <label>Название</label>
                    <MainInput
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                    />

                    <label>Описание</label>
                    <MainTextarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />

                    <label>Цена (₽)</label>
                    <MainInput
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        required
                    />

                    <label>Количество на складе</label>
                    <MainInput
                        type="number"
                        value={formData.countInStock}
                        onChange={(e) => setFormData({...formData, countInStock: Number(e.target.value)})}
                    />

                    <label>Скидка (%)</label>
                    <MainInput
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                    />

                    <label>Артикул</label>
                    <MainInput
                        value={formData.article}
                        onChange={(e) => setFormData({...formData, article: e.target.value})}
                    />

                    <label>Страна</label>
                    <MainInput value={formData.country}
                               onChange={(e) => setFormData({...formData, country: e.target.value})}/>

                    <label>Тип упаковки</label>
                    <MainInput value={formData.package}
                               onChange={(e) => setFormData({...formData, package: e.target.value})}/>

                    <label>
                        <input
                            type="checkbox"
                            checked={!!formData.isActive}
                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        />{' '}
                        Активен
                    </label>

                    <Button 
                        type="submit" 
                        className="full-width mt-10"
                        loading={isUpdatingProduct}
                        disabled={isUpdatingProduct}
                    >
                        Сохранить
                    </Button>
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
                    >
                        {JSON.stringify(uploadResponse, null, 2)}
                    </pre>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({isOpen: false, productId: null})}
                onConfirm={handleDeleteConfirm}
                title="Удаление товара"
                message="Вы уверены, что хотите удалить этот товар?"
                confirmText="Удалить"
                cancelText="Отмена"
                confirmButtonStyle="danger"
            />
        </div>
    );
};