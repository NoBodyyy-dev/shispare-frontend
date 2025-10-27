import React, {SetStateAction, useEffect, useMemo, useState} from "react";
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

export const getInitials = (fullName: string): string => {
    if (!fullName) return "";
    const parts = fullName.trim().split(/\s+/);
    return parts.slice(0, 2).map(part => part[0]?.toUpperCase() ?? '').join('');
}


// hooks/util.hook.ts
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): { (): void; cancel: () => void } {
    let timeoutId: number | null = null;

    const debouncedFunction = () => {
        if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
        }
        timeoutId = window.setTimeout(() => {
            func();
        }, delay);
    };

    debouncedFunction.cancel = () => {
        if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return debouncedFunction;
}

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [value, delay]);

    return debouncedValue;
}