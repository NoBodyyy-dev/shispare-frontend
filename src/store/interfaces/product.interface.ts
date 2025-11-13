import {CategoryData} from "./category.interface";

export interface CartProductInterface {
    _id: string;               // ID позиции в корзине
    product: ProductInterface; // Продукт
    article: number;      // Индекс выбранного варианта
    quantity: number;          // Количество
    addedAt: Date;             // Время добавления
}

export interface IColor {
    ru: string;
    hex: string;
}

export interface IPackage {
    type: string;   // Тип упаковки (мешок, ведро, картридж и т.д.)
    count: number;  // Объём / вес / количество
    unit: string;   // Ед. измерения (кг, л, шт)
}

export interface IVariant {
    article: number;       // Артикул
    price: number;         // Цена (₽)
    color: IColor;         // Цвет
    package: IPackage;     // Упаковка
    discount: number;      // Скидка (%)
    countInStock: number;  // Остаток на складе
}

export interface ISEO {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    ogImage?: string;
}

export interface ProductInterface {
    _id: string;
    title: string;
    description?: string;
    slug: string;

    // Связанная категория
    category: CategoryData;

    // Основная информация
    country: string;
    images: string[];
    documents: string[];
    characteristics?: string[];

    // Метрики
    displayedRating: number;
    totalComments: number;
    totalRatings: number;
    totalPurchases: number;

    // Флаг активности
    isActive: boolean;

    // ✅ Главное изменение — массив вариантов
    variants: IVariant[];

    // SEO данные
    seo?: ISEO;

    createdAt: Date;
    updatedAt: Date;
}

export interface ProductState {
    products: ProductInterface[];
    discountProducts: ProductInterface[];
    popularProducts: ProductInterface[];
    categoryProducts: ProductInterface[];
    currentProduct: ProductInterface | null;
    curCategory: string;

    importExcelResult: never | null;

    // Загрузки
    isLoadingImportingExcel: boolean;
    isLoadingProducts: boolean;
    isLoadingDiscountProducts: boolean;
    isLoadingPopularProducts: boolean;
    isLoadingCategoryProducts: boolean;
    isLoadingProduct: boolean;
    isCreatingProduct: boolean;
    isCheckingProducts: boolean;

    // Ошибки
    productsError?: string;
    discountProductsError?: string;
    popularProductsError?: string;
    categoryProductsError?: string;
    productError?: string;
    createProductError: string;
    checkProductsError: string;
    importExcelError: string;
}