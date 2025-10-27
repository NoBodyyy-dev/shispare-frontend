import {createContext, useContext, ReactNode, useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../hooks/state.hook.ts';
import {UserInterface} from "../store/interfaces/user.interface.ts";
import {getMeFunc} from "../store/actions/user.action.ts";

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user?: UserInterface;
    isLoading: boolean; // Добавляем состояние загрузки
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { token, isAuthenticated, curUser } = useAppSelector(state => state.user);
    const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
    const dispatch = useAppDispatch();
    const intervalRef = useRef<number>();

    useEffect(() => {
        console.log("Penis")
        if (!token) {
            setIsLoading(false);
            return;
        }

        const refreshToken = async () => {
            try {
                setIsLoading(true);
                await dispatch(getMeFunc()).unwrap();
            } finally {
                setIsLoading(false);
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
            isLoading // Добавляем в контекст
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