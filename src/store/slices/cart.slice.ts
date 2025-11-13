import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState } from "../interfaces/cart.interface";
import { CartProductInterface, ProductInterface } from "../interfaces/product.interface";
import { getCart, addToCart, updateQuantity, removeFromCart, clearCart, syncCart } from "../actions/cart.action.ts";
import { debounce } from "../../hooks/util.hook";

const CART_KEY = "cart";
const DEBOUNCE_DELAY = 1000;

// ─────────────────────────────
// localStorage helpers
// ─────────────────────────────
const loadLocal = (): CartProductInterface[] => {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
        return [];
    }
};

const saveLocal = (items: CartProductInterface[]) => {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
        localStorage.setItem(CART_KEY, JSON.stringify([]));
    }
};

const recalcTotals = (state: CartState) => {
    let total = 0;
    let count = 0;

    for (const item of state.products) {
        const variant = item.product?.variants?.find(v => v.article === item.article);
        if (!variant) continue;
        total += variant.price * item.quantity;
        count += item.quantity;
    }

    state.totalAmount = total;
    state.discountAmount = 0;
    state.finalAmount = total;
    state.totalProducts = count;
};

const upsertItem = (
    items: CartProductInterface[],
    product: ProductInterface,
    article: number,
    quantity: number
) => {
    const idx = items.findIndex(i => i.product._id === product._id && i.article === article);

    if (quantity <= 0) {
        if (idx >= 0) items.splice(idx, 1);
        return;
    }

    if (idx >= 0) {
        items[idx].quantity = quantity;
    } else {
        items.push({
            _id: crypto.randomUUID?.() || `${product._id}-${article}-${Date.now()}`,
            product,
            article,
            quantity,
            addedAt: new Date(),
        });
    }
};

// Инициализируем корзину из localStorage только для неавторизованных пользователей
// Для авторизованных корзина будет загружена с сервера
const getInitialState = (): CartState => {
    const localProducts = loadLocal();
    // Пересчитываем итоги для локальной корзины
    let total = 0;
    let count = 0;
    for (const item of localProducts) {
        const variant = item.product?.variants?.find(v => v.article === item.article);
        if (variant) {
            total += variant.price * item.quantity;
            count += item.quantity;
        }
    }
    
    return {
        products: localProducts,
        totalAmount: total,
        discountAmount: 0,
        totalProducts: count,
        finalAmount: total,
        isLoading: false,
        error: "",
    };
};

const initialState: CartState = getInitialState();

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setQuantityLocal: (
            state,
            action: PayloadAction<{
                product: ProductInterface;
                article: number;
                quantity: number;
                isAuthenticated?: boolean;
            }>
        ) => {
            const { product, article, quantity, isAuthenticated = false } = action.payload;
            upsertItem(state.products, product, article, Math.max(0, quantity));
            recalcTotals(state);
            // Сохраняем в localStorage только для неавторизованных пользователей
            if (!isAuthenticated) {
                saveLocal(state.products);
            }
        },
        addItemUI: (
            state,
            action: PayloadAction<{
                product: ProductInterface;
                article: number;
                quantity: number;
                isAuthenticated?: boolean;
            }>
        ) => {
            const { product, article, quantity, isAuthenticated = false } = action.payload;
            const idx = state.products.findIndex(
                i => i.product._id === product._id && i.article === article
            );
            
            if (idx >= 0) {
                state.products[idx].quantity += quantity;
            } else {
                state.products.push({
                    _id: crypto.randomUUID?.() || `${product._id}-${article}-${Date.now()}`,
                    product,
                    article,
                    quantity,
                    addedAt: new Date(),
                });
            }
            recalcTotals(state);
            // Сохраняем в localStorage только для неавторизованных пользователей
            if (!isAuthenticated) {
                saveLocal(state.products);
            }
        },
        updateQuantityUI: (
            state,
            action: PayloadAction<{
                productId: string;
                article: number;
                quantity: number;
                isAuthenticated?: boolean;
            }>
        ) => {
            const { productId, article, quantity, isAuthenticated = false } = action.payload;
            const idx = state.products.findIndex(
                i => i.product._id === productId && i.article === article
            );
            
            if (idx >= 0) {
                if (quantity <= 0) {
                    state.products.splice(idx, 1);
                } else {
                    state.products[idx].quantity = quantity;
                }
            }
            recalcTotals(state);
            // Сохраняем в localStorage только для неавторизованных пользователей
            if (!isAuthenticated) {
                saveLocal(state.products);
            }
        },
        removeItemUI: (
            state,
            action: PayloadAction<{
                productId: string;
                article: number;
                isAuthenticated?: boolean;
            }>
        ) => {
            const { productId, article, isAuthenticated = false } = action.payload;
            state.products = state.products.filter(
                i => !(i.product._id === productId && i.article === article)
            );
            recalcTotals(state);
            // Сохраняем в localStorage только для неавторизованных пользователей
            if (!isAuthenticated) {
                saveLocal(state.products);
            }
        },
        clearCartLocal: (state, action: PayloadAction<{ isAuthenticated?: boolean } | undefined>) => {
            const isAuthenticated = action?.payload?.isAuthenticated || false;
            state.products = [];
            recalcTotals(state);
            // Сохраняем в localStorage только для неавторизованных пользователей
            if (!isAuthenticated) {
                saveLocal([]);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCart.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.isLoading = false;
                // Преобразуем данные из бэкенда в формат фронтенда
                if (action.payload?.items) {
                    state.products = action.payload.items.map((item: any) => ({
                        _id: `${item.product._id}-${item.article}`,
                        product: item.product,
                        article: item.article,
                        quantity: item.quantity,
                        addedAt: new Date(),
                    }));
                } else {
                    state.products = [];
                }
                state.totalAmount = action.payload?.totalAmount || 0;
                state.discountAmount = action.payload?.discountAmount || 0;
                state.finalAmount = action.payload?.finalAmount || 0;
                state.totalProducts = action.payload?.totalProducts || 0;
                // Для авторизованных пользователей НЕ сохраняем в localStorage
                // localStorage используется только для неавторизованных
                // Очищаем localStorage при загрузке корзины с сервера
                localStorage.removeItem(CART_KEY);
            })
            .addCase(getCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка загрузки корзины";
            })
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload?.items) {
                    state.products = action.payload.items.map((item: any) => ({
                        _id: `${item.product._id}-${item.article}`,
                        product: item.product,
                        article: item.article,
                        quantity: item.quantity,
                        addedAt: new Date(),
                    }));
                    // Обновляем lastSentQuantity после успешного добавления
                    const key = `${action.payload.items[0]?.product?._id}:${action.payload.items[0]?.article}`;
                    if (key && action.payload.items[0]) {
                        const lastSentQuantity = (window as any).__lastSentQuantity__ || new Map();
                        lastSentQuantity.set(key, action.payload.items[0].quantity);
                        (window as any).__lastSentQuantity__ = lastSentQuantity;
                    }
                }
                state.totalAmount = action.payload?.totalAmount || 0;
                state.discountAmount = action.payload?.discountAmount || 0;
                state.finalAmount = action.payload?.finalAmount || 0;
                state.totalProducts = action.payload?.totalProducts || 0;
                // Для авторизованных пользователей НЕ сохраняем в localStorage
                // Данные уже на сервере
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка добавления товара";
                // При ошибке сервера корзина уже обновлена оптимистично через UI обработчики
                // Сервер вернет актуальное состояние при следующем getCart
            })
            .addCase(updateQuantity.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload?.items) {
                    state.products = action.payload.items.map((item: any) => ({
                        _id: `${item.product._id}-${item.article}`,
                        product: item.product,
                        article: item.article,
                        quantity: item.quantity,
                        addedAt: new Date(),
                    }));
                    // Обновляем lastSentQuantity после успешного обновления
                    action.payload.items.forEach((item: any) => {
                        const key = `${item.product?._id}:${item.article}`;
                        if (key) {
                            const lastSentQuantity = (window as any).__lastSentQuantity__ || new Map();
                            lastSentQuantity.set(key, item.quantity);
                            (window as any).__lastSentQuantity__ = lastSentQuantity;
                        }
                    });
                }
                state.totalAmount = action.payload?.totalAmount || 0;
                state.discountAmount = action.payload?.discountAmount || 0;
                state.finalAmount = action.payload?.finalAmount || 0;
                state.totalProducts = action.payload?.totalProducts || 0;
                // Для авторизованных пользователей НЕ сохраняем в localStorage
                // Данные уже на сервере
            })
            .addCase(updateQuantity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка обновления количества";
                // При ошибке сервера корзина уже обновлена оптимистично через UI обработчики
                // Откат выполняется в setQuantitySmart через rollback
            })
            .addCase(removeFromCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload?.items) {
                    state.products = action.payload.items.map((item: any) => ({
                        _id: `${item.product._id}-${item.article}`,
                        product: item.product,
                        article: item.article,
                        quantity: item.quantity,
                        addedAt: new Date(),
                    }));
                } else {
                    state.products = [];
                }
                state.totalAmount = action.payload?.totalAmount || 0;
                state.discountAmount = action.payload?.discountAmount || 0;
                state.finalAmount = action.payload?.finalAmount || 0;
                state.totalProducts = action.payload?.totalProducts || 0;
                // Для авторизованных пользователей НЕ сохраняем в localStorage
                // Данные уже на сервере
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка удаления товара";
                // При ошибке сервера корзина уже обновлена оптимистично через UI обработчики
                // Нужно вернуть товар обратно в корзину
                // Это можно сделать через перезагрузку корзины с сервера
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.isLoading = false;
                state.products = [];
                state.totalAmount = 0;
                state.discountAmount = 0;
                state.finalAmount = 0;
                state.totalProducts = 0;
                // Для авторизованных пользователей НЕ сохраняем в localStorage
                // Данные уже на сервере
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка очистки корзины";
            })
            .addCase(syncCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(syncCart.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload?.items) {
                    state.products = action.payload.items.map((item: any) => ({
                        _id: `${item.product._id}-${item.article}`,
                        product: item.product,
                        article: item.article,
                        quantity: item.quantity,
                        addedAt: new Date(),
                    }));
                }
                state.totalAmount = action.payload?.totalAmount || 0;
                state.discountAmount = action.payload?.discountAmount || 0;
                state.finalAmount = action.payload?.finalAmount || 0;
                state.totalProducts = action.payload?.totalProducts || 0;
                // После синхронизации очищаем localStorage, так как теперь данные на сервере
                localStorage.removeItem(CART_KEY);
            })
            .addCase(syncCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Ошибка синхронизации корзины";
            });
    },
});

export const { setQuantityLocal, addItemUI, updateQuantityUI, removeItemUI, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;

import { AppDispatch } from "../store"; // тип вашего dispatch

export const setQuantitySmart = (() => {
    const debounced = new Map<string, ReturnType<typeof debounce>>();
    // Используем глобальное хранилище, чтобы оно сохранялось между вызовами
    const getLastSentQuantity = () => {
        if (!(window as any).__lastSentQuantity__) {
            (window as any).__lastSentQuantity__ = new Map<string, number>();
        }
        return (window as any).__lastSentQuantity__ as Map<string, number>;
    };

    return ({
                dispatch,
                product,
                article,
                quantity,
                isAuthenticated,
                prevQuantity,
            }: {
        dispatch: AppDispatch;
        product: ProductInterface;
        article: number;
        quantity: number;
        isAuthenticated: boolean;
        prevQuantity: number;
    }) => {
        // Получаем текущее состояние корзины для проверки наличия товара
        const store = (window as any).__store__;
        const getState = store?.getState;
        const currentState = getState?.();
        const cartItem = currentState?.cart?.products?.find(
            (p: CartProductInterface) => p.product._id === product._id && p.article === article
        );
        const isInCart = !!cartItem;

        // Оптимистичное обновление UI - обновляем сразу для мгновенного отклика
        if (quantity <= 0) {
            dispatch(removeItemUI({ productId: product._id, article, isAuthenticated }));
        } else if (isInCart) {
            // Товар уже в корзине - обновляем количество
            dispatch(updateQuantityUI({ productId: product._id, article, quantity, isAuthenticated }));
        } else {
            // Товара нет в корзине - добавляем
            dispatch(addItemUI({ product, article, quantity, isAuthenticated }));
        }

        // гость → только localStorage, не отправляем на сервер
        if (!isAuthenticated) return;

        // debounce key
        const key = `${product._id}:${article}`;
        
        // Отменяем предыдущий запрос, если он есть
        if (debounced.has(key)) {
            debounced.get(key)?.cancel();
        }

        // Сохраняем количество, которое мы собираемся отправить
        // Это значение будет использовано в debounced функции
        const quantityToSend = quantity;
        
        // Используем уже полученные store и getState из начала функции

        const action = debounce(async () => {
            try {
                // Получаем актуальное количество из состояния Redux на момент выполнения
                let currentQuantityInState = quantityToSend;
                let wasInCart = false;
                
                if (getState) {
                    const state = getState();
                    const cartItem = state.cart.products.find(
                        (p: CartProductInterface) => p.product._id === product._id && p.article === article
                    );
                    if (cartItem) {
                        currentQuantityInState = cartItem.quantity;
                        wasInCart = true;
                    }
                }
                
                // Используем последнее отправленное количество
                const lastSentQuantity = getLastSentQuantity();
                const lastSent = lastSentQuantity.get(key);

                if (quantityToSend <= 0) {
                    await dispatch(removeFromCart({ productId: product._id, article })).unwrap();
                    lastSentQuantity.delete(key);
                } else if (lastSent === undefined && !wasInCart) {
                    // Если товара точно не было в корзине (первое добавление), добавляем
                    // Используем quantityToSend - финальное количество после всех быстрых кликов
                    await dispatch(addToCart({ productId: product._id, article, quantity: quantityToSend })).unwrap();
                    lastSentQuantity.set(key, quantityToSend);
                } else {
                    // Если товар уже был в корзине или мы уже отправляли запрос, обновляем количество напрямую
                    // Это важно для быстрых кликов - всегда устанавливаем финальное количество, а не добавляем
                    await dispatch(updateQuantity({ productId: product._id, article, quantity: quantityToSend })).unwrap();
                    lastSentQuantity.set(key, quantityToSend);
                }
            } catch (error) {
                // rollback - возвращаемся к последнему успешно отправленному количеству
                const lastSentQuantity = getLastSentQuantity();
                const rollbackQty = lastSentQuantity.get(key) ?? prevQuantity;
                
                // Проверяем, был ли товар в корзине до ошибки
                const stateBeforeError = getState?.();
                const wasInCartBefore = stateBeforeError?.cart?.products?.find(
                    (p: CartProductInterface) => p.product._id === product._id && p.article === article
                );
                
                // Откатываем UI к предыдущему состоянию
                if (rollbackQty <= 0) {
                    if (wasInCartBefore) {
                        dispatch(removeItemUI({ productId: product._id, article, isAuthenticated }));
                    }
                } else {
                    if (wasInCartBefore) {
                        dispatch(updateQuantityUI({ productId: product._id, article, quantity: rollbackQty, isAuthenticated }));
                    } else {
                        dispatch(addItemUI({ product, article, quantity: rollbackQty, isAuthenticated }));
                    }
                }
                console.error("Ошибка обновления корзины:", error);
            }
        }, DEBOUNCE_DELAY);

        debounced.set(key, action);
        action();
    };
})();