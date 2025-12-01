import {FC, useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {MainInput} from "../../lib/input/MainInput.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import {FaSearch} from "react-icons/fa";
import api from "../../store/api.ts";
import {useDebounce} from "../../hooks/util.hook.ts";
import styles from "./calculator.module.sass";
import {SEO} from "../../lib/seo/SEO.tsx";

interface SearchSuggestion {
    _id: string;
    title: string;
    slug: string;
    images: string[];
    category: any;
    variants: any[];
    variantIndex: number;
}

export const CalculatorPage: FC = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: "/calculator", label: "Калькулятор"},
    ];

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                const {data} = await api.get(
                    `/product/search/suggestions?q=${encodeURIComponent(debouncedQuery)}&limit=10`
                );
                if (data.success && data.suggestions) {
                    setSuggestions(data.suggestions);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error('Ошибка получения подсказок:', error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [debouncedQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProductSelect = (suggestion: SearchSuggestion) => {
        const variant = suggestion.variants?.[suggestion.variantIndex || 0];
        if (variant?.article) {
            setShowSuggestions(false);
            navigate(`/calculator/${variant.article}`);
        }
    };

    const handleSearch = () => {
        if (query.trim()) {
            // Можно добавить поиск по артикулу
            const articleNumber = Number(query.trim());
            if (!isNaN(articleNumber) && articleNumber > 0) {
                navigate(`/calculator/${articleNumber}`);
            }
        }
    };

    return (
        <>
            <SEO
                title="Калькулятор расхода материалов"
                description="Калькулятор для расчета расхода строительных материалов. Выберите товар и рассчитайте необходимое количество."
                keywords="калькулятор, расчет материалов, строительные материалы, расход"
                url="/calculator"
                type="website"
            />
            <div className="main__container">
                <Breadcrumbs items={breadcrumbsItems} isLoading={false}/>
                <h1 className="title mb-20">Калькулятор расхода материалов</h1>

                <div className={styles.searchSection}>
                    <h2 className={styles.searchTitle}>Начните расчет</h2>
                    <p className={styles.description}>
                        Выберите товар для расчета необходимого количества материала
                    </p>
                </div>

                <div className={styles.searchContainer} ref={suggestionsRef}>
                    <div className={styles.searchInputWrapper}>
                        <MainInput
                            type="text"
                            placeholder="Поиск товара по названию или артикулу..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            className={styles.searchInput}
                        />
                        <Button
                            onClick={handleSearch}
                            className={styles.searchButton}
                        >
                            <FaSearch/>
                        </Button>
                    </div>

                    {showSuggestions && query.length >= 2 && (
                        <div className={styles.suggestionsDropdown}>
                            {isLoading && (
                                <div className={styles.suggestionItem}>
                                    <div className={styles.loading}>Загрузка...</div>
                                </div>
                            )}

                            {!isLoading && suggestions.length === 0 && query.length >= 2 && (
                                <div className={styles.suggestionItem}>
                                    <div className={styles.noResults}>Ничего не найдено</div>
                                </div>
                            )}

                            {!isLoading && suggestions.length > 0 && (
                                <>
                                    {suggestions.map((suggestion) => {
                                        const variant = suggestion.variants?.[suggestion.variantIndex || 0];
                                        return (
                                            <div
                                                key={suggestion._id}
                                                className={styles.suggestionItem}
                                                onClick={() => handleProductSelect(suggestion)}
                                            >
                                                {suggestion.images[0] && (
                                                    <img
                                                        src={suggestion.images[0]}
                                                        alt={suggestion.title}
                                                        className={styles.suggestionImage}
                                                    />
                                                )}
                                                <div className={styles.suggestionContent}>
                                                    <div className={styles.suggestionTitle}>
                                                        {suggestion.title}
                                                        {variant && (
                                                            <span className={styles.variantInfo}>
                                                                    ({variant.color.ru}, {variant.package.type})
                                                                </span>
                                                        )}
                                                    </div>
                                                    {suggestion.category && (
                                                        <div className={styles.suggestionCategory}>
                                                            {suggestion.category.title || suggestion.category.name}
                                                        </div>
                                                    )}
                                                    {variant && (
                                                        <div className={styles.suggestionArticle}>
                                                            Артикул: {variant.article}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.introSection}>
                    <p className={styles.introText}>
                        Компания Sika представляет калькулятор сухих строительных смесей. С помощью удобного
                        онлайн-сервиса вы легко рассчитаете нужное количество материалов для любого вида строительных и
                        отделочных работ.
                    </p>

                    <p className={styles.importantText}>
                        Расчет сухой смеси – важный этап перед началом строительства, ведь покупка материалов «на глаз»
                        приводит к лишним денежным тратам или к задержке работ, а в некоторых случаях к нарушению
                        технологического процесса и браку.
                    </p>
                </div>

                <div className={styles.instructionsSection}>
                    <h2 className={styles.instructionsTitle}>Как использовать калькулятор расхода сухих смесей?</h2>

                    <p className={styles.instructionsIntro}>
                        Вы можете использовать сервис, как калькулятор цементной стяжки пола, полимерных напольных
                        покрытий, добавок в бетон, гидроизоляционных и других смесей. Во всех случаях расчет
                        стройматериала требует нескольких простых действий:
                    </p>

                    <ol className={styles.stepsList}>
                        <li className={styles.stepItem}>
                            <span className={styles.stepNumber}>1</span>
                            <span className={styles.stepText}>Выберите продукт из приведенного списка.</span>
                        </li>
                        <li className={styles.stepItem}>
                            <span className={styles.stepNumber}>2</span>
                            <span
                                className={styles.stepText}>Укажите толщину слоя в мм и площадь поверхности в м².</span>
                        </li>
                        <li className={styles.stepItem}>
                            <span className={styles.stepNumber}>3</span>
                            <span className={styles.stepText}>Кликните кнопку «рассчитать».</span>
                        </li>
                    </ol>

                    <p className={styles.resultInfo}>
                        Калькулятор строительных смесей выдаст готовые расчеты с указанием общей массы материала и
                        необходимого количества мешков весом по 25 кг.
                    </p>
                </div>

                <div className={styles.companySection}>
                    <p className={styles.companyText}>
                        Швейцарский концерн Sika – один из мировых лидеров в области производства модифицирующих добавок
                        в бетон и сухих смесей для устройства цементных и полимерных стяжек пола, гидроизоляции, укладки
                        плитки, отделки стен и фасадов и других работ. Компания Sika гарантирует высокое качество своей
                        продукции при условии соблюдения расчетных параметров и строительных технологий.
                    </p>
                </div>


            </div>
        </>
    );
};

