import {FC, useState, useRef, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {createSolutionFunc} from "../../store/actions/solution.action.ts";
import {addMessage} from "../../store/slices/push.slice.ts";
import {Button} from "../../lib/buttons/Button.tsx";
import {MainInput} from "../../lib/input/MainInput.tsx";
import {ProductInterface} from "../../store/interfaces/product.interface.ts";
import api from "../../store/api.ts";
import {useNavigate} from "react-router-dom";
import styles from "./createSolution.module.sass";

interface Point {
    left: number;
    top: number;
    index: number;
}

interface SolutionDetail {
    section: string;
    description?: string;
    products: ProductInterface[];
    position: {
        left: number;
        top: number;
    };
}

export const CreateSolutionPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {isLoadingSolutions} = useAppSelector(state => state.solution);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [details, setDetails] = useState<SolutionDetail[]>([]);
    const [currentDetailIndex, setCurrentDetailIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<ProductInterface[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [solutionName, setSolutionName] = useState<string>("");
    
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout>();
    const STORAGE_KEY = "createSolutionDraft";

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                if (data.solutionName) setSolutionName(data.solutionName);
                if (data.preview) setPreview(data.preview);
                
                // Восстанавливаем points с position
                if (data.points && Array.isArray(data.points)) {
                    setPoints(data.points);
                }
                
                // Восстанавливаем details с position
                if (data.details && Array.isArray(data.details)) {
                    // Убеждаемся, что position сохранен для каждого detail
                    const restoredDetails = data.details.map((detail: any, index: number) => ({
                        ...detail,
                        position: detail.position || (data.points?.[index] ? {
                            left: data.points[index].left,
                            top: data.points[index].top
                        } : { left: 0, top: 0 })
                    }));
                    setDetails(restoredDetails);
                }
            }
        } catch (error) {
            console.error("Ошибка загрузки данных из localStorage:", error);
        }
    }, []);

    useEffect(() => {
        try {
            const dataToSave = {
                solutionName,
                preview,
                // Сохраняем points с position (left, top, index)
                points: points.map(point => ({
                    left: point.left,
                    top: point.top,
                    index: point.index
                })),
                // Сохраняем details с position из каждого detail
                details: details.map(detail => ({
                    section: detail.section,
                    description: detail.description,
                    products: detail.products.map(p => ({
                        _id: p._id,
                        title: p.title,
                        images: p.images,
                        variants: p.variants,
                        category: p.category
                    })),
                    // Сохраняем position из detail
                    position: {
                        left: detail.position.left,
                        top: detail.position.top
                    }
                }))
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Ошибка сохранения в localStorage:", error);
        }
    }, [solutionName, preview, points, details]);

    useEffect(() => {
        if (searchQuery.length >= 2) {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            searchTimeoutRef.current = setTimeout(async () => {
                setIsSearching(true);
                try {
                    const {data} = await api.get(`/product/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
                    if (data.success && data.products) {
                        setSearchResults(data.products);
                    } else {
                        setSearchResults([]);
                    }
                } catch (error) {
                    console.error("Ошибка поиска:", error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            }, 300);
        } else {
            setSearchResults([]);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const previewData = reader.result as string;
                setPreview(previewData);
                // Очищаем точки и детали при смене изображения
                setPoints([]);
                setDetails([]);
                setCurrentDetailIndex(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current || !preview) return;

        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const left = (x / rect.width) * 100;
        const top = (y / rect.height) * 100;

        const newPoint: Point = {
            left: Math.max(0, Math.min(100, left)),
            top: Math.max(0, Math.min(100, top)),
            index: points.length + 1
        };

        setPoints([...points, newPoint]);
        console.log(">>> points", points)
        
        const newDetail: SolutionDetail = {
            section: "",
            products: [],
            position: {
                left: newPoint.left,
                top: newPoint.top
            }
        };
        
        const newDetails = [...details, newDetail];
        setDetails(newDetails);
        setCurrentDetailIndex(newDetails.length - 1);

        setTimeout(() => {
            if (formRef.current) {
                formRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }
        }, 100);
    };

    const handleRemovePoint = (index: number) => {
        setPoints(points.filter((_, i) => i !== index));
        const newDetails = details.filter((_, i) => i !== index);
        setDetails(newDetails);
        if (currentDetailIndex === index) {
            setCurrentDetailIndex(null);
        } else if (currentDetailIndex !== null && currentDetailIndex > index) {
            setCurrentDetailIndex(currentDetailIndex - 1);
        }
    };

    const handleDetailChange = (index: number, field: 'section' | 'description', value: string) => {
        const newDetails = [...details];
        newDetails[index] = {
            ...newDetails[index],
            [field]: value
        };
        setDetails(newDetails);
    };

    const handleAddProduct = (product: ProductInterface) => {
        if (currentDetailIndex === null) return;
        
        const newDetails = [...details];
        const currentDetail = newDetails[currentDetailIndex];
        
        if (!currentDetail.products.some(p => p._id === product._id)) {
            currentDetail.products = [...currentDetail.products, product];
            newDetails[currentDetailIndex] = currentDetail;
            setDetails(newDetails);
        }
        
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleRemoveProduct = (detailIndex: number, productId: string) => {
        const newDetails = [...details];
        newDetails[detailIndex].products = newDetails[detailIndex].products.filter(
            p => p._id !== productId
        );
        setDetails(newDetails);
    };

    // Конвертация base64 в File
    const base64ToFile = (base64: string, filename: string): File => {
        try {
            const arr = base64.split(',');
            const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        } catch (error) {
            console.error("Ошибка конвертации base64 в File:", error);
            throw new Error("Не удалось конвертировать изображение");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!preview) {
            dispatch(addMessage({text: "Необходимо загрузить изображение", type: "error"}));
            return;
        }

        // Если File объект потерян, но есть preview, конвертируем его обратно в File
        let imageFile = image;
        if (!imageFile && preview) {
            imageFile = base64ToFile(preview, 'solution-image.png');
        }

        if (!solutionName.trim()) {
            dispatch(addMessage({text: "Необходимо указать название решения", type: "error"}));
            return;
        }

        if (details.length === 0) {
            dispatch(addMessage({text: "Необходимо добавить хотя бы одну точку", type: "error"}));
            return;
        }

        for (let i = 0; i < details.length; i++) {
            if (!details[i].section.trim()) {
                dispatch(addMessage({text: `Необходимо указать название секции для точки ${i + 1}`, type: "error"}));
                return;
            }
            if (details[i].products.length === 0) {
                dispatch(addMessage({text: `Необходимо добавить хотя бы один товар для точки ${i + 1}`, type: "error"}));
                return;
            }
        }

        try {
            const formData = new FormData();
            formData.append('file', imageFile!);

            const uploadResponse = await api.post('/user/chat/upload', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!uploadResponse.data.success || !uploadResponse.data.attachment?.url) {
                const errorMessage = uploadResponse.data?.message || "Ошибка загрузки изображения";
                dispatch(addMessage({text: errorMessage, type: "error"}));
                console.error("Ошибка загрузки:", uploadResponse.data);
                return;
            }

            const imageUrl = uploadResponse.data.attachment.url;

            const solutionData = {
                name: solutionName,
                image: imageUrl,
                details: details.map(detail => ({
                    section: detail.section,
                    description: detail.description || "",
                    products: detail.products.map(p => p._id),
                    position: detail.position
                }))
            };

            const result = await dispatch(createSolutionFunc(solutionData));

            if (createSolutionFunc.fulfilled.match(result)) {
                dispatch(addMessage({text: "Решение успешно создано", type: "success"}));
                // Очищаем localStorage после успешного создания
                localStorage.removeItem(STORAGE_KEY);
                navigate("/admin");
            } else {
                const errorPayload = result.payload as any;
                const errorMessage = errorPayload?.message || "Ошибка при создании решения";
                dispatch(addMessage({text: errorMessage, type: "error"}));
            }
        } catch (error: any) {
            console.error("Ошибка создания решения:", error);
            const errorMessage = error?.response?.data?.message || error?.message || "Ошибка при создании решения";
            dispatch(addMessage({text: errorMessage, type: "error"}));
            
            // Если ошибка при загрузке изображения, выводим более детальную информацию
            if (error?.response?.data?.attachment) {
                console.error("Детали ошибки загрузки:", error.response.data);
            }
        }
    };

    return (
        <div className="main__container p-20">
            <div className={styles.createSolution}>
                <h1 className="title mb-20">Создание решения</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.section}>
                        <label className={styles.label}>Название решения</label>
                        <MainInput
                            value={solutionName}
                            onChange={(e) => setSolutionName(e.target.value)}
                            placeholder="Введите название решения"
                            required
                        />
                    </div>

                    <div className={styles.section}>
                        <label className={styles.label}>Изображение</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.fileInput}
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className={styles.fileLabel}>
                            {preview ? "Изменить изображение" : "Выберите изображение"}
                        </label>

                        {preview && (
                            <div 
                                ref={imageContainerRef}
                                className={styles.imageContainer}
                                onClick={handleImageClick}
                            >
                                <img src={preview} alt="Preview" className={styles.previewImage} />
                                {points.map((point, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={styles.point}
                                        style={{
                                            left: `${point.left}%`,
                                            top: `${point.top}%`,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentDetailIndex(index);
                                            setTimeout(() => {
                                                if (formRef.current) {
                                                    formRef.current.scrollIntoView({
                                                        behavior: 'smooth',
                                                        block: 'end',
                                                    });
                                                }
                                            }, 100);
                                        }}
                                    >
                                        {point.index}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {details.length > 0 && (
                        <div ref={formRef} className={styles.detailsSection}>
                            <h2 className="subtitle mb-20">Детали решения</h2>
                            
                            {details.map((detail, index) => (
                                <div key={index} className={styles.detailCard}>
                                    <div className={styles.detailHeader}>
                                        <h3 className={styles.detailTitle}>Точка {index + 1}</h3>
                                        <Button
                                            type="button"
                                            onClick={() => handleRemovePoint(index)}
                                            className={styles.removeButton}
                                        >
                                            Удалить
                                        </Button>
                                    </div>

                                    <div className={styles.detailForm}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Название секции</label>
                                            <MainInput
                                                value={detail.section}
                                                onChange={(e) => handleDetailChange(index, 'section', e.target.value)}
                                                placeholder="Введите название секции"
                                                required
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Описание (необязательно)</label>
                                            <MainInput
                                                value={detail.description || ""}
                                                onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
                                                placeholder="Введите описание"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Товары</label>
                                            <div className={styles.searchContainer}>
                                                <MainInput
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Поиск товаров..."
                                                    onFocus={() => {
                                                        if (currentDetailIndex !== index) {
                                                            setCurrentDetailIndex(index);
                                                        }
                                                    }}
                                                />
                                                {isSearching && (
                                                    <div className={styles.searchLoading}>Поиск...</div>
                                                )}
                                                {!isSearching && searchQuery.length >= 2 && searchResults.length > 0 && (
                                                    <div className={styles.searchResults}>
                                                        {searchResults.map((product) => (
                                                            <div
                                                                key={product._id}
                                                                className={styles.searchResultItem}
                                                                onClick={() => {
                                                                    setCurrentDetailIndex(index);
                                                                    handleAddProduct(product);
                                                                }}
                                                            >
                                                                <img
                                                                    src={product.images?.[0] || "/no-image.svg"}
                                                                    alt={product.title}
                                                                    className={styles.productImage}
                                                                />
                                                                <div className={styles.productInfo}>
                                                                    <div className={styles.productTitle}>{product.title}</div>
                                                                    {product.variants?.[0] && (
                                                                        <div className={styles.productVariant}>
                                                                            Артикул: {product.variants[0].article}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className={styles.selectedProducts}>
                                                {detail.products.map((product) => (
                                                    <div key={product._id} className={styles.selectedProduct}>
                                                        <img
                                                            src={product.images?.[0] || "/no-image.svg"}
                                                            alt={product.title}
                                                            className={styles.productThumb}
                                                        />
                                                        <span className={styles.productName}>{product.title}</span>
                                                        <Button
                                                            type="button"
                                                            onClick={() => handleRemoveProduct(index, product._id)}
                                                            className={styles.removeProductButton}
                                                        >
                                                            ×
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles.submitSection}>
                        <Button 
                            type="submit" 
                            className={styles.submitButton}
                            loading={isLoadingSolutions}
                            disabled={isLoadingSolutions}
                        >
                            Создать решение
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

