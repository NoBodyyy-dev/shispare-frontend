import React from "react";
import {IoIosLogOut} from "react-icons/io";
import {useEffect, useCallback} from "react";
import {useNavigate, useParams, NavLink, Outlet} from "react-router-dom";
import {useAppDispatch} from "../../hooks/state.hook.ts";
import {useAuth} from "../../context/AuthContext.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import {logoutFunc} from "../../store/actions/user.action.ts";
import styles from "./lk.module.sass";

export const Lk = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {id: paramsId} = useParams();
    const {isAuthenticated, user, isLoading: authLoading} = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !user?._id || user?.role === "User" && paramsId && user._id !== paramsId) navigate(-1);
    }, [isAuthenticated, user, paramsId]);

    const handleLogout = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(logoutFunc());
        navigate("/");
    }, []);

    if (authLoading) return (
        <div className={styles.container}>
            <div className={styles.loader}>Загрузка данных...</div>
        </div>
    );

    return (
        <div className="main__container">
            <div className={`${styles.container} main__block gap-20`}>
                <aside className={`${styles.sidebar} p-20`}>
                    <h2 className="subtitle mb-20">Личный кабинет</h2>
                    <nav className={styles.nav}>
                        <NavLink
                            to={`/lk/${paramsId}`}
                            end
                            className={({isActive}) =>
                                `${styles.navItem} ${isActive ? styles.active : ""}`
                            }
                        >
                            Профиль
                        </NavLink>
                        <NavLink
                            to={`/lk/${paramsId}/orders`}
                            className={({isActive}) =>
                                `${styles.navItem} ${isActive ? styles.active : ""}`
                            }
                        >
                            Заказы
                        </NavLink>
                        <NavLink
                            to={`/lk/${paramsId}/comments`}
                            className={({isActive}) =>
                                `${styles.navItem} ${isActive ? styles.active : ""}`
                            }
                        >
                            Отзывы
                        </NavLink>
                    </nav>
                    {user?._id === paramsId && (
                        <Button
                            onClick={handleLogout}
                            className={`${styles.logoutBtn} full-width`}
                        >
                            <div className="flex-align-center">
                                <p className="fz-16 mt-2 mr-5 pl-16"><IoIosLogOut/></p>
                                <p>Выйти</p>
                            </div>
                        </Button>
                    )}
                </aside>
                <main className={styles.content}>
                    <Outlet/>
                </main>
            </div>

        </div>
    );
};