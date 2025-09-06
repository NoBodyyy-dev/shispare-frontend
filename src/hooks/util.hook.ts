import React, {SetStateAction, useEffect, useMemo} from "react";
import api from "../store/api.ts";
import {ProductInterface} from "../store/interfaces/product.interface.ts";

export const useLocaleTime = (time: Date): string => {
    return useMemo(() => {
        const newTime = new Date(time);
        const hours = newTime.getHours().toString().padStart(2, '0');
        const minutes = newTime.getMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes}`;
    }, [time]);
};
export const useHandleDate = () => {
    return (date: Date | string) => {
        const dateString = typeof date === 'string' ? date : date.toISOString();
        const [year, month, day] = dateString.split('T')[0].split('-');
        return `${day}.${month}.${year}`;
    };
};

export const useCheckCartData = (
    setLoading: (value: SetStateAction<boolean>) => void,
    setData: React.Dispatch<React.SetStateAction<ProductInterface[]>>,
    setError: (value: SetStateAction<string | null>) => void,
    dataForResponse: string[]) => {
    return useEffect(() => {
        const fetchViewedProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.post("/product/check", {productIds: dataForResponse});
                setData(response.data.products);
            } catch (err) {
                setError("Не удалось загрузить историю просмотров");
                setData([]);
                console.error("Ошибка при загрузке:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchViewedProducts();
    }, []);
}

type DebouncedFn = ((...args: any[]) => any) & { cancel?: () => void };

export function debounce(fn: (...args: any[]) => any, delay: number): DebouncedFn {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const debounced: DebouncedFn = ((...args: any[]) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    }) as DebouncedFn;

    debounced.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    return debounced;
}