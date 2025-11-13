import {createContext, useContext, ReactNode, useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../hooks/state.hook.ts';
import {UserInterface} from "../store/interfaces/user.interface.ts";
import {getMeFunc} from "../store/actions/user.action.ts";
import {syncCart} from "../store/actions/cart.action.ts";

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user?: UserInterface;
    isLoading: boolean;
    isInitialized: boolean; // Добавляем флаг инициализации
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { token, isAuthenticated, curUser } = useAppSelector(state => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false); // Флаг завершения инициализации
    const dispatch = useAppDispatch();
    const intervalRef = useRef<number>();

    useEffect(() => {
        console.log("AuthProvider initialization");

        if (!token) {
            setIsLoading(false);
            setIsInitialized(true); // Отмечаем что инициализация завершена
            return;
        }

        const refreshToken = async () => {
            try {
                setIsLoading(true);
                await dispatch(getMeFunc()).unwrap();

                const localCart = localStorage.getItem("cart");
                if (localCart) {
                    try {
                        const cartItems = JSON.parse(localCart);
                        if (Array.isArray(cartItems) && cartItems.length > 0) {
                            const items = cartItems
                                .map((item: any) => ({
                                    productId: item.product?._id || item.productId,
                                    article: item.article,
                                    quantity: item.quantity || 1,
                                }))
                                .filter((item: any) => item.productId && item.article);

                            if (items.length > 0) {
                                await dispatch(syncCart(items)).unwrap();
                            }
                        }
                    } catch (e) {
                        console.error("Ошибка синхронизации корзины:", e);
                    }
                }
            } finally {
                setIsLoading(false);
                setIsInitialized(true); // Отмечаем что инициализация завершена
            }
        };

        refreshToken();

        intervalRef.current = setInterval(() => {
            dispatch(getMeFunc());
            console.log("update")
        }, 14 * 60 * 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            token,
            user: curUser,
            isLoading,
            isInitialized // Добавляем в контекст
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};