import {useEffect, useCallback} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {useAuth} from "../../context/AuthContext.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import {logoutFunc, getProfileUserFunc} from "../../store/actions/user.action.ts";
import styles from "./Lk.module.sass";
import React from "react";

export const Lk = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {id: paramsId} = useParams();
    const {isAuthenticated, user, isLoading: authLoading} = useAuth();
    const {profileUser, isLoadingProfileUser} = useAppSelector(state => state.user);
    const isLoading = authLoading || isLoadingProfileUser;

    // Редирект для неавторизованных
    useEffect(() => {
        if (!isAuthenticated || !user?._id) navigate("/");
    }, [isAuthenticated]);

    // Проверка прав доступа для обычных пользователей
    useEffect(() => {
        if (user?.role === "User" && paramsId && user._id !== paramsId) {
            navigate(-1);
        }
    }, [user, paramsId]);

    // Загрузка данных пользователя
    useEffect(() => {
        if (!user?._id) return;

        const loadData = async () => {
            if (paramsId && user._id !== paramsId) {
                await dispatch(getProfileUserFunc({id: paramsId}));
            } else {
                console.log("Penis")
            }
        };

        loadData();
    }, [paramsId, user?._id]);

    const currentUser = paramsId && user?._id !== paramsId
        ? profileUser
        : user;

    const handleLogout = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(logoutFunc());
        navigate("/");
    }, []);

    if (isLoading) return (
        <div className={styles.container}>
            <div className={styles.loader}>Загрузка данных...</div>
        </div>
    );

    return (
        <div className="main__container">
            <h1 className="title mb-20">Личный кабинет</h1>
            <Button
                onClick={handleLogout}
                className={styles.logoutBtn}
            >
                Выйти
            </Button>

            <section className={styles.profileSection}>
                <h2>Профиль</h2>
                <div className={styles.profileGrid}>
                    <ProfileField
                        label="ФИО"
                        value={currentUser?.fullName}
                    />

                    <ProfileField
                        label="Email"
                        value={currentUser?.email}
                    />

                    <ProfileField
                        label="Тип аккаунта"
                        value={currentUser?.role === "User" ? "Физическое лицо" : "Администратор"}
                    />

                    {currentUser?.legalName && (
                        <ProfileField
                            label="Юридическое лицо"
                            value={currentUser.legalName}
                        />
                    )}

                    {currentUser?.legalType && (
                        <ProfileField
                            label="Форма собственности"
                            value={currentUser.legalType}
                        />
                    )}

                    {currentUser?.legalId && (
                        <ProfileField
                            label="ИНН/Идентификатор"
                            value={currentUser.legalId.toString()}
                        />
                    )}

                    <ProfileField
                        label="Статус"
                        value={currentUser?.banned ? "Заблокирован" : "Активен"}
                        status={currentUser?.banned ? "error" : "success"}
                    />
                </div>
            </section>

            <section className={styles.ordersSection}>
                <h2>История заказов</h2>
                {/*{orders?.length ? (*/}
                {/*    <div className={styles.ordersGrid}>*/}
                {/*        <div className={styles.orderHeader}>ID заказа</div>*/}
                {/*        <div className={styles.orderHeader}>Дата</div>*/}
                {/*        <div className={styles.orderHeader}>Сумма</div>*/}
                {/*        <div className={styles.orderHeader}>Статус</div>*/}

                {/*        {orders.map(order => (*/}
                {/*            <React.Fragment key={order._id}>*/}
                {/*                <div>{order._id}</div>*/}
                {/*                <div>{new Date(order.date).toLocaleDateString()}</div>*/}
                {/*                <div>{order.total} ₽</div>*/}
                {/*                <div className={styles[`status-${order.status}`]}>*/}
                {/*                    {order.status}*/}
                {/*                </div>*/}
                {/*            </React.Fragment>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*) : (*/}
                {/*    <p className={styles.noOrders}>Заказы не найдены</p>*/}
                {/*)}*/}
            </section>
        </div>
    );
};

const ProfileField = ({
                          label,
                          value,
                          status
                      }: {
    label: string;
    value?: string;
    status?: "success" | "error";
}) => (
    <>
        <div className={styles.label}>{label}:</div>
        <div className={`${styles.value} ${status ? styles[status] : ""}`}>
            {value || "—"}
        </div>
    </>
);