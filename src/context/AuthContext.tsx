import {createContext, useContext, ReactNode, useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '../hooks/state.hook.ts';
import {UserInterface} from "../store/interfaces/user.interface.ts";
import {getMeFunc} from "../store/actions/user.action.ts";

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user?: UserInterface;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { token, isAuthenticated, curUser } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const intervalRef = useRef<number>();

    useEffect(() => {
        if (!token) return;

        dispatch(getMeFunc());

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
            user: curUser
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