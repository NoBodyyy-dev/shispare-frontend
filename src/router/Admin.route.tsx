import { ReactNode } from 'react';
import { AuthMiddleware } from './Auth.middleware.tsx';

interface AdminRouteProps {
    children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
    return (
        <AuthMiddleware requireAuth requiredRole="Admin">
            {children}
        </AuthMiddleware>
    );
};