/**
 * Утилиты для работы с cookie
 */

/**
 * Устанавливает cookie
 * @param name - имя cookie
 * @param value - значение cookie
 * @param days - количество дней до истечения (по умолчанию 365)
 * @param path - путь (по умолчанию "/")
 */
export const setCookie = (
    name: string,
    value: string,
    days: number = 365,
    path: string = "/"
): void => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    
    // Определяем, находимся ли мы на HTTPS (для production)
    const isSecure = window.location.protocol === "https:";
    
    let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${path}; SameSite=Lax`;
    
    if (isSecure) {
        cookieString += "; Secure";
    }
    
    document.cookie = cookieString;
};

/**
 * Получает значение cookie по имени
 * @param name - имя cookie
 * @returns значение cookie или null, если не найдено
 */
export const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    
    return null;
};

/**
 * Удаляет cookie
 * @param name - имя cookie
 * @param path - путь (по умолчанию "/")
 */
export const deleteCookie = (name: string, path: string = "/"): void => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
};

/**
 * Проверяет наличие cookie
 * @param name - имя cookie
 * @returns true, если cookie существует
 */
export const hasCookie = (name: string): boolean => {
    return getCookie(name) !== null;
};





