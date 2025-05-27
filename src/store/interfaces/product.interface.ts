export type ProductInterface = Partial<{
  _id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  image: string;
  article: string;
  discount: number;
  rating: number;
  category: {
    title: string;
    slug: string;
  };
  productImages: string[];
  countProducts: number;
  colors: string[];
  characteristics: string[];
  consumption: number;
  documents: string[];
  totalPurchases: number;
}>;

export interface ProductState {
  products: ProductInterface[];
  discountProducts: ProductInterface[];
  popularProducts: ProductInterface[];
  categoryProducts: ProductInterface[];
  product: ProductInterface;
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
