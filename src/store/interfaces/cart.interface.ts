import {CartProductInterface} from "./product.interface.ts";

export interface CartState {
    products: CartProductInterface[];
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    totalProducts: number;
    isLoading: boolean;
    error: string;
}
