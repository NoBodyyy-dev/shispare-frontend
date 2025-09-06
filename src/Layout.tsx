import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useAuth} from "./context/AuthContext.tsx";
import {Preloader} from "./lib/Lottie/Preloader.tsx";
import {UserLayout} from "./layouts/UserLayout.tsx";
import {AdminLayout} from "./layouts/AdminLayout.tsx";
import {UserOnlyBodyLayout} from "./layouts/UserOnlyBodyLayout.tsx";
import {useAppDispatch} from "./hooks/state.hook.ts";
import {getCart} from "./store/actions/cart.action.ts";

const changeLayoutPaths = ["/notFound", "/auth"];

export const Layout = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { isLoading, user } = useAuth();

    useEffect(() => {
        if (isLoading) dispatch(getCart());
    }, [isLoading]);

    if (isLoading) return <Preloader/>;
    if (changeLayoutPaths.includes(location.pathname)) return <UserOnlyBodyLayout />;
    if (user?.role === "Admin") return <AdminLayout/>;
    return <UserLayout/>;
};