export type ProductInterface = {
    _id: string;
    title: string;
    description: string;
    slug: string;
    article: string;
    discount: number;
    rating: number;
    category: {
        title: string;
        slug: string;
    };
    images: string[];
    characteristics: string[];
    documents: string[];
    totalPurchases: number;
    country: string;
    shelfLife: string;            // Срок хранения (общий)
    variants: IProductVariant[];  // Варианты товара
    variantIndex: number;         // Индекс варианта
};

export interface IProductVariant {
    sku: string;
    article: number;
    price: number;
    discount: number;
    countInStock: number;
    rating: number;
    countOnPallet: number;
    color: {
        ru: string;
        en: string;
    };
    package: {
        type: string;
        count: number;
        unit: string;
    };
}


export interface CartProductInterface {
    product: ProductInterface;
    quantity: number;
    addedAt: Date;
}

export interface ProductState {
    products: ProductInterface[];
    discountProducts: ProductInterface[];
    popularProducts: ProductInterface[];
    categoryProducts: ProductInterface[];
    currentProduct: ProductInterface | null;
    curCategory: string;
    isLoadingProducts: boolean;
    isLoadingDiscountProducts: boolean;
    isLoadingPopularProducts: boolean;
    isLoadingCategoryProducts: boolean;
    isLoadingProduct: boolean;
    productsError?: string;
    discountProductsError?: string;
    popularProductsError?: string;
    categoryProductsError?: string;
    productError?: string;
}
