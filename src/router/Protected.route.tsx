import { ReactNode } from 'react';
import { AuthMiddleware } from './Auth.middleware.tsx';

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    return (
        <AuthMiddleware requireAuth>
            {children}
        </AuthMiddleware>
    );
};