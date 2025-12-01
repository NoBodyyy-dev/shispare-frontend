import {useState, useEffect, useRef} from 'react'
import {useNavigate} from "react-router-dom"
import {MainInput} from "./MainInput.tsx";
import {Button} from "../buttons/Button.tsx";
import {useDebounce} from "../../hooks/util.hook.ts";
import {FaSearch} from "react-icons/fa";
import {ProductSuggestions} from "../products/ProductSuggestion.tsx";
import {CategoryData} from "../../store/interfaces/category.interface.ts";
import {IVariant} from "../../store/interfaces/product.interface.ts";
import styles from "./input.module.sass"
import api from "../../store/api.ts";

interface SearchSuggestion {
    _id: string;
    title: string;
    slug: string;
    images: string[];
    category: CategoryData | null;
    variants: IVariant[];
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
                    `/product/search/suggestions?q=${encodeURIComponent(debouncedQuery)}&limit=4`
                )
                if (data.success && data.suggestions) {
                    setSuggestions(data.suggestions.slice(0, 4))
                } else {
                    setSuggestions([])
                }
            } catch (error) {
                console.error('Ошибка получения подсказок:', error)
                setSuggestions([])
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

                {showSuggestions && query.length >= 2 && (
                    <div className={styles.suggestionsDropdown}>
                        {isLoading && (
                            <div className={styles.loading}>Загрузка...</div>
                        )}

                        {!isLoading && suggestions.length === 0 && (
                            <div className={styles.noResults}>Ничего не найдено</div>
                        )}

                        {!isLoading && suggestions.length > 0 && (
                            <>
                                {suggestions.map((suggestion) => (
                                    <ProductSuggestions
                                        key={suggestion._id}
                                        {...suggestion}
                                        onSelect={() => setShowSuggestions(false)}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
            <Button onClick={() => {
                handleSearch();
                setShowSuggestions(false);
            }}>
                <FaSearch/>
            </Button>
        </div>
    )
}