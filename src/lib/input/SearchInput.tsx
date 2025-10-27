// SearchInput.tsx
import {useState, useEffect, useRef} from 'react'
import {useNavigate} from "react-router-dom"
import {MainInput} from "./MainInput.tsx";
import {Button} from "../buttons/Button.tsx";
import styles from "./input.module.sass"
import {useDebounce} from "../../hooks/util.hook.ts";
import api from "../../store/api.ts";
import {FaSearch} from "react-icons/fa";
import {ProductSuggestions} from "../products/ProductSuggestion.tsx";
import {CategoryData} from "../../store/interfaces/category.interface.ts";
import {IProductVariant} from "../../store/interfaces/product.interface.ts";

interface SearchSuggestion {
    _id: string;
    title: string;
    slug: string;
    images: string[];
    category: CategoryData;
    variants: IProductVariant[];
    variantIndex: number;
}

export const SearchInput = () => {
    const [query, setQuery] = useState<string>("")
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const debouncedQuery = useDebounce(query, 300)
    const suggestionsRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedQuery.length < 2) {
                setSuggestions([])
                return
            }

            setIsLoading(true)
            try {
                const {data} = await api.get(
                    `/product/search/suggestions?q=${encodeURIComponent(debouncedQuery)}&limit=5`
                )
                setSuggestions(data)
            } catch (error) {
                console.error('Ошибка получения подсказок:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSuggestions()
    }, [debouncedQuery])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        setQuery(suggestion.title)
        setShowSuggestions(false)
        navigate(`/product/${suggestion.slug}`)
    }

    const highlightMatch = (text: string, search: string) => {
        if (!search) return text

        const regex = new RegExp(`(${search})`, 'gi')
        const parts = text.split(regex)

        return parts.map((part, index) =>
            regex.test(part) ? <mark key={index}>{part}</mark> : part
        )
    }

    return (
        <div className={`${styles.header} flex ${styles.searchContainer}`} ref={suggestionsRef}>
            <div className="flex-align-center full-width" style={{position: 'relative'}}>
                <MainInput
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder='Искать по названию, категории, артикулу'
                    className="full-width border-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />

                {showSuggestions && (query.length > 0 || suggestions.length > 0) && (
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

                        {!isLoading && suggestions.map((suggestion) => (
                            <ProductSuggestions
                                key={suggestion._id}
                                {...suggestion}
                            />
                        ))}

                        {!isLoading && suggestions.length > 0 && (
                            <div className={styles.suggestionFooter}>
                                <Button
                                    onClick={handleSearch}
                                    className={styles.seeAllResults}
                                >
                                    Посмотреть все результаты
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Button onClick={handleSearch}>
                <FaSearch/>
            </Button>
        </div>
    )
}