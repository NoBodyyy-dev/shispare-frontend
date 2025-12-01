import {FC, useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {getProductFunc} from "../../store/actions/product.action.ts";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {MainInput} from "../../lib/input/MainInput.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import {ProductInterface, IVariant} from "../../store/interfaces/product.interface.ts";
import styles from "./calculator.module.sass";
import {SEO} from "../../lib/seo/SEO.tsx";

export const CalculatorResultPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {article} = useParams<{article: string}>();
    const {currentProduct, isLoadingProduct} = useAppSelector(state => state.product);
    
    const [area, setArea] = useState<string>("");
    const [consumption, setConsumption] = useState<string>("");
    const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null);
    const [result, setResult] = useState<{
        packages: number;
        totalQuantity: number;
        totalPrice: number;
        priceWithDiscount: number;
    } | null>(null);

    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: "/calculator", label: "Калькулятор"},
        {path: `/calculator/${article}`, label: currentProduct?.title || "Расчет"},
    ];

    useEffect(() => {
        if (article) {
            const articleNumber = Number(article);
            if (!isNaN(articleNumber) && articleNumber > 0) {
                dispatch(getProductFunc(articleNumber));
            }
        }
    }, [article, dispatch]);

    useEffect(() => {
        if (currentProduct?.variants && currentProduct.variants.length > 0) {
            // Находим вариант с нужным артикулом или берем первый
            const variant = currentProduct.variants.find(v => v.article === Number(article)) 
                || currentProduct.variants[0];
            setSelectedVariant(variant);
        }
    }, [currentProduct, article]);

    const calculate = () => {
        if (!selectedVariant || !area || !consumption) {
            return;
        }

        const areaValue = parseFloat(area.replace(',', '.'));
        const consumptionValue = parseFloat(consumption.replace(',', '.'));

        if (isNaN(areaValue) || isNaN(consumptionValue) || areaValue <= 0 || consumptionValue <= 0) {
            return;
        }

        // Вычисляем необходимое количество материала
        const totalQuantity = areaValue * consumptionValue;
        
        // Получаем данные упаковки
        const packageCount = selectedVariant.package.count;
        const packageUnit = selectedVariant.package.unit;
        
        // Вычисляем количество упаковок (округляем вверх)
        const packages = Math.ceil(totalQuantity / packageCount);
        
        // Вычисляем стоимость
        const pricePerUnit = selectedVariant.price;
        const discount = selectedVariant.discount || 0;
        const priceWithDiscount = pricePerUnit * (1 - discount / 100);
        
        // Итоговая стоимость
        const totalPrice = packages * priceWithDiscount;

        setResult({
            packages,
            totalQuantity,
            totalPrice,
            priceWithDiscount
        });
    };

    useEffect(() => {
        if (area && consumption && selectedVariant) {
            calculate();
        } else {
            setResult(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [area, consumption, selectedVariant]);

    const handleBack = () => {
        navigate("/calculator");
    };

    if (isLoadingProduct) {
        return (
            <div className="main__container">
                <div className={styles.loader}>Загрузка товара...</div>
            </div>
        );
    }

    if (!currentProduct) {
        return (
            <div className="main__container">
                <div className={styles.error}>Товар не найден</div>
                <Button onClick={handleBack} className={styles.backButton}>
                    Вернуться к поиску
                </Button>
            </div>
        );
    }

    const variant = selectedVariant || currentProduct.variants[0];

    return (
        <>
            <SEO
                title={`Калькулятор: ${currentProduct.title}`}
                description={`Расчет расхода материала ${currentProduct.title}`}
                keywords={`калькулятор, ${currentProduct.title}, расчет материалов`}
                url={`/calculator/${article}`}
                type="website"
            />
            <div className="main__container">
                <Breadcrumbs items={breadcrumbsItems} isLoading={isLoadingProduct} />
                
                <div className={styles.calculatorResult}>
                    <div className={styles.productInfo}>
                        <Button onClick={handleBack} className={styles.backButton}>
                            ← Выбрать другой товар
                        </Button>
                        
                        <div className={styles.productCard}>
                            {currentProduct.images?.[0] && (
                                <img 
                                    src={currentProduct.images[0]} 
                                    alt={currentProduct.title}
                                    className={styles.productImage}
                                />
                            )}
                            <div className={styles.productDetails}>
                                <h2 className={styles.productTitle}>{currentProduct.title}</h2>
                                {currentProduct.description && (
                                    <p className={styles.productDescription}>{currentProduct.description}</p>
                                )}
                                {currentProduct.variants && currentProduct.variants.length > 1 && (
                                    <div className={styles.variantSelector}>
                                        <label className={styles.label}>Выберите вариант:</label>
                                        <select
                                            value={selectedVariant?.article || ""}
                                            onChange={(e) => {
                                                const article = Number(e.target.value);
                                                const variant = currentProduct.variants.find(v => v.article === article);
                                                if (variant) {
                                                    setSelectedVariant(variant);
                                                }
                                            }}
                                            className={styles.select}
                                        >
                                            {currentProduct.variants.map((v) => (
                                                <option key={v.article} value={v.article}>
                                                    Артикул {v.article} - {v.color.ru} ({v.package.count} {v.package.unit})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                
                                {variant && (
                                    <div className={styles.variantInfo}>
                                        <div className={styles.variantRow}>
                                            <span>Артикул:</span>
                                            <strong>{variant.article}</strong>
                                        </div>
                                        <div className={styles.variantRow}>
                                            <span>Цвет:</span>
                                            <strong>{variant.color.ru}</strong>
                                        </div>
                                        <div className={styles.variantRow}>
                                            <span>Упаковка:</span>
                                            <strong>{variant.package.count} {variant.package.unit} ({variant.package.type})</strong>
                                        </div>
                                        <div className={styles.variantRow}>
                                            <span>Цена:</span>
                                            <strong>
                                                {variant.discount > 0 ? (
                                                    <>
                                                        <span className={styles.oldPrice}>{variant.price.toLocaleString()} ₽</span>
                                                        <span className={styles.newPrice}>{Math.round(variant.price * (1 - variant.discount / 100)).toLocaleString()} ₽</span>
                                                    </>
                                                ) : (
                                                    <span>{variant.price.toLocaleString()} ₽</span>
                                                )}
                                            </strong>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.calculatorForm}>
                        <h2 className="subtitle mb-20">Параметры расчета</h2>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Площадь (м²)
                            </label>
                            <MainInput
                                type="text"
                                inputMode="decimal"
                                value={area}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^\d.,]/g, '');
                                    setArea(value);
                                }}
                                placeholder="Введите площадь"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Расход материала (кг/м² или л/м²)
                            </label>
                            <MainInput
                                type="text"
                                inputMode="decimal"
                                value={consumption}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^\d.,]/g, '');
                                    setConsumption(value);
                                }}
                                placeholder="Введите расход на м²"
                                className={styles.input}
                            />
                            <p className={styles.hint}>
                                Укажите расход материала на 1 м² согласно инструкции
                            </p>
                        </div>

                        {result && variant && (
                            <div className={styles.result}>
                                <h3 className={styles.resultTitle}>Результат расчета</h3>
                                
                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Необходимое количество:</span>
                                    <span className={styles.resultValue}>
                                        {result.totalQuantity.toFixed(2)} {variant.package.unit}
                                    </span>
                                </div>

                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Количество упаковок:</span>
                                    <span className={styles.resultValue}>
                                        {result.packages} шт.
                                    </span>
                                </div>

                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Цена за упаковку:</span>
                                    <span className={styles.resultValue}>
                                        {result.priceWithDiscount.toLocaleString()} ₽
                                    </span>
                                </div>

                                <div className={styles.resultItem}>
                                    <span className={styles.resultLabel}>Итоговая стоимость:</span>
                                    <span className={styles.resultValue}>
                                        <strong>{result.totalPrice.toLocaleString()} ₽</strong>
                                    </span>
                                </div>

                                {variant.discount > 0 && (
                                    <div className={styles.discountInfo}>
                                        Экономия: {((variant.price - result.priceWithDiscount) * result.packages).toLocaleString()} ₽
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

