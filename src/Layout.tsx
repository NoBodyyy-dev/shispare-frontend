import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "./context/AuthContext.tsx";
import {Preloader} from "./lib/loaders/Preloader.tsx";
import {UserLayout} from "./layouts/UserLayout.tsx";
import {AdminLayout} from "./layouts/AdminLayout.tsx";
import {UserOnlyBodyLayout} from "./layouts/UserOnlyBodyLayout.tsx";
import {useAppDispatch} from "./hooks/state.hook.ts";
import {getCart} from "./store/actions/cart.action.ts";

const userOnlyBodyPaths = [
    "/auth",
    "/auth/confirm",
    "/403",
    "/404",
    "/500",
];

const shouldUseUserOnlyBodyLayout = (pathname: string) => {
    return userOnlyBodyPaths.includes(pathname);
};

export const Layout = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const {isLoading, user} = useAuth();

    useEffect(() => {
        if (!isLoading && user?._id) dispatch(getCart());
    }, [isLoading, user?._id]);

    useEffect(() => {
        if (isLoading) return;

        const protectedRoutes = ["/cart/checkout", "/orders", "/lk"];
        if (!user?.role && protectedRoutes.some(route => location.pathname.startsWith(route))) {
            navigate('/auth', {replace: true});
            return;
        }

        const adminRoutes = ["/admin", "/users"];
        if (user?.role !== "Admin" && adminRoutes.some(route => location.pathname.startsWith(route))) {
            navigate('/403', {replace: true});
            return;
        }

        if (user?._id && location.pathname === '/auth') {
            navigate('/', {replace: true});
            return;
        }

    }, [location.pathname, isLoading, user, navigate]);

    if (isLoading) return <Preloader/>;

    if (shouldUseUserOnlyBodyLayout(location.pathname)) {
        return <UserOnlyBodyLayout/>;
    }

    if (user?.role === "Admin")
        return <AdminLayout/>;
    return <UserLayout/>;
};