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
        if (!token) {
            setIsLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                setIsLoading(true);
                await dispatch(getMeFunc()).unwrap();
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();

        intervalRef.current = setInterval(() => {
            dispatch(getMeFunc());
        }, 15 * 60 * 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [token, isAuthenticated]);

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
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};