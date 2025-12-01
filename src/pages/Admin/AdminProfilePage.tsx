import React from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./adminProfile.module.sass";

export const AdminProfilePage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className={styles.loader}>Загрузка данных...</div>;
    }

    const roleDisplayName = user.role === "Admin" ? "Администратор" :
                           user.role === "Creator" ? "Создатель" : 
                           "Пользователь";

    const adminPermissions = [
        { name: "Управление товарами", description: "Создание, редактирование и удаление товаров" },
        { name: "Управление категориями", description: "Создание и изменение категорий товаров" },
        { name: "Управление заказами", description: "Просмотр и изменение статусов заказов" },
        { name: "Управление пользователями", description: "Просмотр, блокировка и управление пользователями" },
        { name: "Управление блогом", description: "Создание и редактирование статей блога" },
        { name: "Управление заявками", description: "Обработка заявок от пользователей" },
        { name: "Доступ к чату", description: "Общение с пользователями в системе чата" },
        { name: "Просмотр аналитики", description: "Доступ к статистике и отчетам" },
    ];

    return (
        <div className="main__container p-20">
            <div className={styles.header}>
                <h1 className={styles.title}>Личный кабинет администратора</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Личные данные</h2>
                    <div className={styles.infoGrid}>
                        <InfoField label="ФИО" value={user.fullName} />
                        <InfoField label="Email" value={user.email} />
                        {user.legalName && (
                            <InfoField label="Юридическое лицо" value={user.legalName} />
                        )}
                        {user.legalType && (
                            <InfoField 
                                label="Тип аккаунта" 
                                value={user.legalType === "ЮЛ" ? "Юридическое лицо" : "Индивидуальный предприниматель"} 
                            />
                        )}
                        {user.legalId && (
                            <InfoField label="ИНН / Идентификатор" value={user.legalId.toString()} />
                        )}
                        <InfoField 
                            label="Статус аккаунта" 
                            value={user.banned ? "Заблокирован" : "Активен"}
                            status={user.banned ? "error" : "success"}
                        />
                        {user.telegramId && (
                            <InfoField label="Telegram ID" value={user.telegramId.toString()} />
                        )}
                        {user.personalKey && (
                            <InfoField label="Персональный ключ" value={user.personalKey} />
                        )}
                        <InfoField 
                            label="Онлайн статус" 
                            value={user.online ? "В сети" : "Не в сети"}
                            status={user.online ? "success" : undefined}
                        />
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Роль в системе</h2>
                    <div className={styles.roleCard}>
                        <div className={styles.roleIcon}>👤</div>
                        <div className={styles.roleInfo}>
                            <div className={styles.roleName}>{roleDisplayName}</div>
                            <div className={styles.roleDescription}>
                                {user.role === "Admin" && "Полный доступ ко всем функциям системы управления"}
                                {user.role === "Creator" && "Доступ к созданию и редактированию контента"}
                                {user.role === "User" && "Обычный пользователь системы"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoField: React.FC<{
    label: string;
    value?: string | number;
    status?: "success" | "error";
}> = ({ label, value, status }) => (
    <div className={styles.infoField}>
        <div className={styles.infoLabel}>{label}</div>
        <div className={`${styles.infoValue} ${status ? styles[status] : ""}`}>
            {value || "—"}
        </div>
    </div>
);





