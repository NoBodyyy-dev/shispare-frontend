import {ReactNode} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from "../context/AuthContext.tsx";

interface AuthMiddlewareProps {
    children: ReactNode;
    requireAuth?: boolean;
    requiredRole?: 'User' | 'Admin';
    fallbackPath?: string;
}

export const AuthMiddleware = ({
                                   children,
                                   requireAuth = false,
                                   requiredRole,
                                   fallbackPath = '/auth'
                               }: AuthMiddlewareProps) => {
    const {isAuthenticated, user} = useAuth();
    const location = useLocation();

    if (requireAuth && !isAuthenticated) {
        return <Navigate to={fallbackPath} state={{from: location}} replace/>;
    }

    if (requiredRole === 'Admin' && user?.role !== 'Admin') {
        return <Navigate to="/403" replace />;
    }

    if (requiredRole === 'User' && user?.role !== 'User' && user?.role !== 'Admin') {
        return <Navigate to="/403" replace />;
    }

    if (!requireAuth && isAuthenticated && location.pathname === '/auth') {
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
};