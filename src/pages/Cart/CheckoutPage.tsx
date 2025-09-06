import {FC, useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import styles from "./checkout.module.sass";
import {CartSummary} from "./CartSummary.tsx";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {MainInput} from "../../lib/input/MainInput.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {createOrderFunc} from "../../store/actions/order.action.ts";
import {DeliveryType, PaymentMethod} from "../../store/interfaces/order.interface.ts";
import {useNavigate} from "react-router-dom";

interface AddressSuggestion {
    address: {
        formatted_address: string,
        component: {
            name: string,
            kind: string[]
        }[]
    }
    distance: { value: number, text: string }
    subtitle: { text: string }
    tags: string[]
    title: { text: string, hl: { begin: number, end: number } }
}

enum DeliveryKind {
    PICKUP = "pickup",
    KRASNODAR = "krasnodar",
    RUSSIA = "russia"
}

enum PaymentMethodKind {
    CARD = "card",
    SBP = "sbp",
    CASH = "cash",
    CASH_ON_SITE = "cash_on_site"
}

type CheckoutForm = {
    deliveryKind: DeliveryType;
    phone: string;
    fullName?: string;
    isSelfPickupPerson: boolean;
    address?: string;
    paymentMethod: PaymentMethod;
    comment?: string;
};

const phoneRegexp = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

const CHECKOUT_FORM_STORAGE_KEY = "checkout_form_data";

export const CheckoutPage: FC = () => {
    const dispatch = useAppDispatch();
    const {products} = useAppSelector(state => state.cart);
    const navigate = useNavigate();

    useEffect(() => {
        if (!products.length) navigate(-1)
    }, []);

    const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const [addressInput, setAddressInput] = useState("");


    const getSavedFormData = (): Partial<CheckoutForm> => {
        try {
            const saved = localStorage.getItem(CHECKOUT_FORM_STORAGE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error("Error loading checkout form data:", error);
            return {};
        }
    };

    const saveFormData = (data: Partial<CheckoutForm>) => {
        try {
            localStorage.setItem(CHECKOUT_FORM_STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Error saving checkout form data:", error);
        }
    };

    const {register, handleSubmit, watch, setValue, reset, formState: {errors}} = useForm<CheckoutForm>({
        mode: "onChange",
        defaultValues: {
            deliveryKind: DeliveryType.PICKUP,
            isSelfPickupPerson: true,
            ...getSavedFormData() // Load saved data as default values
        }
    });

    const deliveryKind = watch("deliveryKind");
    const isSelfPickupPerson = watch("isSelfPickupPerson");

    const formValues = watch();

    useEffect(() => {
        saveFormData(formValues);
    }, [formValues]);

    useEffect(() => {
        const savedData = getSavedFormData();
        if (savedData.address) {
            setAddressInput(savedData.address);
        }
    }, []);

    const fetchAddressSuggestions = async (query: string) => {
        if (!query.trim() || query.length < 2) {
            setAddressSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsLoadingAddress(true);
        try {
            const apiKey = "a343e3ef-bfdd-4222-b31d-7c33ee9c2825";
            const url = `https://suggest-maps.yandex.ru/v1/suggest?apikey=${apiKey}&types=geo&text=${encodeURIComponent(query)}&lang=ru_RU&results=10&origin=jsapi2Geocoder&strict_bounds=0&print_address=1`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.results && Array.isArray(data.results)) {
                const suggestions: AddressSuggestion[] = data.results
                    .filter((item: AddressSuggestion) => item && item.title && item.title.text) // Фильтруем валидные элементы
                    .map((item: AddressSuggestion) => ({
                        address: item.address || {formatted_address: "", component: []},
                        distance: item.distance || {value: 0, text: ""},
                        subtitle: item.subtitle || {text: ""},
                        tags: item.tags || [],
                        title: item.title || {text: "", hl: {begin: 0, end: 0}}
                    }));

                console.log("Processed suggestions:", suggestions); // Для отладки

                setAddressSuggestions(suggestions);
                setShowSuggestions(suggestions.length > 0);
            } else {
                console.log("No results or invalid data structure:", data);
                setAddressSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error("Ошибка при поиске адресов:", error);
            setAddressSuggestions([]);
        } finally {
            setIsLoadingAddress(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (addressInput) {
                fetchAddressSuggestions(addressInput);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [addressInput]);

    const handleAddressSelect = (suggestion: AddressSuggestion) => {
        setValue("address", suggestion.address.formatted_address);
        setAddressInput(suggestion.address.formatted_address);
        setShowSuggestions(false);
        setAddressSuggestions([]);

        console.log("Selected address:", suggestion);
    };

    const onSubmit = (data: CheckoutForm) => {
        dispatch(createOrderFunc(data));
        reset();
    };

    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: "/cart", label: "Корзина"},
        {path: "/cart/checkout", label: "Оформление заказа"},
    ];

    return (
        <div className="main__container">
            <Breadcrumbs items={breadcrumbsItems} isLoading={false}/>
            <h1 className="title mb-20">Оформление заказа</h1>

            <div className={styles.checkout}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Способ получения</h2>
                        <div className={styles.radioGrid}>
                            <label className={styles.radioItem}>
                                <input type="radio" value={DeliveryKind.PICKUP} {...register("deliveryKind")} />
                                <span>Самовывоз</span>
                            </label>
                            <label className={styles.radioItem}>
                                <input type="radio" value={DeliveryKind.KRASNODAR} {...register("deliveryKind")} />
                                <span>Доставка по Краснодару</span>
                            </label>
                            <label className={styles.radioItem}>
                                <input type="radio" value={DeliveryKind.RUSSIA} {...register("deliveryKind")} />
                                <span>Доставка по России</span>
                            </label>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Данные получателя</h2>
                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label>Телефон *</label>
                                <MainInput
                                    placeholder="+7 (999) 123-45-67"
                                    {...register("phone", {
                                        required: "Укажите телефон",
                                        pattern: {value: phoneRegexp, message: "Некорректный номер"}
                                    })}
                                />
                                {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <label className={styles.checkbox}>
                                <input type="checkbox" {...register("isSelfPickupPerson")} />
                                <span/> Получу я
                            </label>
                        </div>

                        {(!isSelfPickupPerson) && (
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <label>ФИО получателя *</label>
                                    <MainInput
                                        placeholder="Иванов Иван Иванович"
                                        {...register("fullName", {required: "Укажите ФИО"})}
                                    />
                                    {errors.fullName && <span className={styles.error}>{errors.fullName.message}</span>}
                                </div>
                            </div>
                        )}
                    </div>

                    {(deliveryKind === DeliveryType.KRASNODAR || deliveryKind === DeliveryType.RUSSIA) && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Адрес доставки</h2>
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <label>Адрес *</label>
                                    <div className={styles.addressInputWrapper}>
                                        <MainInput
                                            className="full-width"
                                            placeholder="Город, улица, дом, квартира"
                                            value={addressInput}
                                            onChange={(e) => setAddressInput(e.target.value)}
                                            onFocus={() => setShowSuggestions(addressSuggestions.length > 0)}
                                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        />
                                        {isLoadingAddress && <div className={styles.addressSpinner}></div>}

                                        {showSuggestions && addressSuggestions.length > 0 && (
                                            <div className={styles.addressSuggestions}>
                                                {addressSuggestions.map((suggestion, index) => (
                                                    <div
                                                        key={index}
                                                        className={styles.addressSuggestionItem}
                                                        onClick={() => handleAddressSelect(suggestion)}
                                                    >
                                                        <div className={styles.suggestionText}>
                                                            {suggestion.title.text}
                                                        </div>
                                                        <div className={styles.suggestionSubtitle}>
                                                            {suggestion.subtitle.text}
                                                        </div>
                                                        <div className={styles.suggestionMeta}>
                                                             <span className={styles.suggestionType}>
                                                                 {suggestion.tags[0] || "место"}
                                                             </span>
                                                            {suggestion.distance.text && (
                                                                <span className={styles.suggestionDistance}>
                                                                     {suggestion.distance.text}
                                                                 </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {errors.address && <span className={styles.error}>{errors.address.message}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Способ оплаты</h2>
                        <div className={styles.radioGrid}>
                            {deliveryKind === DeliveryType.PICKUP ? (
                                <>
                                    <label className={styles.radioItem}>
                                        <input
                                            type="radio"
                                            value={PaymentMethodKind.CASH_ON_SITE}
                                            {...register("paymentMethod", {required: "Выберите способ оплаты"})}
                                        />
                                        <span className={styles.radioIcon}>💳</span>
                                        <span>Оплата на месте</span>
                                    </label>
                                    <label className={styles.radioItem}>
                                        <input
                                            type="radio"
                                            value={PaymentMethodKind.CARD}
                                            {...register("paymentMethod", {required: "Выберите способ оплаты"})}
                                        />
                                        <span className={styles.radioIcon}>💳</span>
                                        <span>Банковской картой</span>
                                    </label>
                                    <label className={styles.radioItem}>
                                        <input
                                            type="radio"
                                            value={PaymentMethodKind.SBP}
                                            {...register("paymentMethod", {required: "Выберите способ оплаты"})}
                                        />
                                        <span className={styles.radioIcon}>📱</span>
                                        <span>СБП</span>
                                    </label>
                                </>
                            ) : (
                                <>
                                    <label className={styles.radioItem}>
                                        <input
                                            type="radio"
                                            value={PaymentMethod.CARD}
                                            {...register("paymentMethod", {required: "Выберите способ оплаты"})}
                                        />
                                        <span className={styles.radioIcon}>💳</span>
                                        <span>Банковская карта</span>
                                    </label>
                                    <label className={styles.radioItem}>
                                        <input
                                            type="radio"
                                            value={PaymentMethod.SBP}
                                            {...register("paymentMethod", {required: "Выберите способ оплаты"})}
                                        />
                                        <span className={styles.radioIcon}>📱</span>
                                        <span>СБП</span>
                                    </label>
                                    <label className={styles.radioItem}>
                                        <input
                                            type="radio"
                                            value={PaymentMethod.CASH}
                                            {...register("paymentMethod", {required: "Выберите способ оплаты"})}
                                        />
                                        <span className={styles.radioIcon}>💵</span>
                                        <span>Наличные при доставке</span>
                                    </label>
                                </>
                            )}
                        </div>
                        {errors.paymentMethod &&
                            <span className={styles.error}>{errors.paymentMethod.message}</span>}
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                            <label>Комментарий к заказу</label>
                            <MainInput
                                placeholder="Комментарий"
                                {...register("comment")}
                            />
                            {errors.fullName && <span className={styles.error}>{errors.fullName.message}</span>}
                        </div>
                    </div>
                    <Button>заказать</Button>
                </form>

                <CartSummary isRedirect={false}/>
            </div>
        </div>
    );
};

export default CheckoutPage;
