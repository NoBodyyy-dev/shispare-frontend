import {useParams} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {useEffect, useState} from "react";
import {banUserFunc, getProfileUserFunc} from "../../store/actions/user.action.ts";
import styles from "./lk.module.sass";
import {Button} from "../../lib/buttons/Button.tsx";

export const ProfileTab = () => {
    const dispatch = useAppDispatch();
    const {profileUser} = useAppSelector(state => state.user);
    const {user} = useAuth();
    const {id: paramsId} = useParams();
    const [isBanning, setIsBanning] = useState(false);

    const currentUser = paramsId && user?._id !== paramsId
        ? profileUser
        : user;

    const isAdmin = user?.role === "Admin";
    const isViewingOtherUser = paramsId && user?._id !== paramsId;

    useEffect(() => {
        if (paramsId && !profileUser?._id) {
            dispatch(getProfileUserFunc({id: paramsId}));
        }
    }, [paramsId, profileUser?._id]);

    const handleBanToggle = async () => {
        if (!currentUser?._id || !isAdmin || !isViewingOtherUser) return;
        
        setIsBanning(true);
        try {
            await dispatch(banUserFunc({
                userId: currentUser._id,
                banned: !currentUser.banned
            })).unwrap();
            // Обновляем данные пользователя
            await dispatch(getProfileUserFunc({id: currentUser._id}));
        } catch (error) {
            console.error('Ошибка при изменении статуса пользователя:', error);
        } finally {
            setIsBanning(false);
        }
    };

    if (!currentUser) return <div className={styles.loader}>Данные пользователя не найдены</div>;

    return (
        <section className={styles.profileSection}>
            <div className={styles.profileHeader}>
                <h1 className="title mb-20">Профиль</h1>
                {isAdmin && isViewingOtherUser && (
                    <Button
                        onClick={handleBanToggle}
                        disabled={isBanning}
                        className={currentUser.banned ? styles.unbanBtn : styles.banBtn}
                    >
                        {isBanning 
                            ? 'Обработка...' 
                            : currentUser.banned 
                                ? 'Разблокировать' 
                                : 'Заблокировать'
                        }
                    </Button>
                )}
            </div>
            <div className={styles.profileGrid}>
                <ProfileField label="ФИО" value={currentUser.fullName}/>
                <ProfileField label="Email" value={currentUser.email}/>
                {currentUser.role === "Admin" && <ProfileField label="Тип аккаунта" value={"Администратор"}/>}
                <ProfileField label="Статус" value={currentUser.banned ? "Заблокирован" : "Активен"}
                              status={currentUser.banned ? "error" : "success"}/>
                {currentUser.legalType === "ЮЛ"
                    && <>
                        <ProfileField label="Форма собственности"
                                      value={currentUser.legalType === "ЮЛ" ? "Юридическое лицо" : "Физическое лицо"}/>
                        <ProfileField label="Юридическое лицо" value={currentUser.legalName}/>
                        <ProfileField label="ИНН / Идентификатор" value={currentUser.legalId?.toString()}/>
                    </>
                }
                <ProfileField label="Telegram ID" value={currentUser.telegramId?.toString()}/>
            </div>
        </section>
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