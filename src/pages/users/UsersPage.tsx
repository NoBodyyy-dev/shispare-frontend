import {FC, useEffect, useState, useCallback, useMemo, ChangeEvent} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {getAllUsersFunc} from "../../store/actions/user.action.ts";
import {Link} from "react-router-dom";
import styles from "./userpage.module.sass";
import {FiSearch} from "react-icons/fi";
import {UserInterface} from "../../store/interfaces/user.interface.ts";
import {MainInput} from "../../lib/input/MainInput.tsx";

export const UsersPage: FC = () => {
    const dispatch = useAppDispatch();
    const {users, isLoadingUsers, errorUsers} = useAppSelector(s => s.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        dispatch(getAllUsersFunc());
    }, []);

    const handleSearchChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
        },
        []
    );

    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;

        const term = searchTerm.toLowerCase();
        return users.filter(user =>
            (user.fullName?.toLowerCase().includes(term)) ||
            (user.email?.toLowerCase().includes(term)) ||
            (user.legalId?.toString().includes(term))
        );
    }, [users, searchTerm]);

    if (errorUsers) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    Ошибка загрузки пользователей: {errorUsers}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Управление пользователями</h1>

            <div className={`${styles.searchContainer} ${isSearchFocused ? styles.focused : ""}`}>
                <FiSearch className={styles.searchIcon}/>
                <MainInput
                    type="text"
                    placeholder="Поиск по имени, email или ИНН..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={`full-width`}
                />
            </div>

            {isLoadingUsers ? (
                <div className={styles.loader}>Загрузка пользователей...</div>
            ) : (
                <>
                    <div className={styles.header}>
                        <div>Пользователь</div>
                        <div>Email</div>
                        <div>Статус</div>
                        <div>Тип</div>
                    </div>

                    <div className={styles.usersList}>
                        {filteredUsers.length === 0 ? (
                            <div className={styles.noResults}>
                                Пользователи не найдены
                            </div>
                        ) : (
                            filteredUsers.map(user => (
                                <UserCard key={user._id} user={user}/>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

const UserCard = ({user}: { user: UserInterface }) => (
    <Link to={`/lk/${user._id}`} className={styles.userCard}>
        <div className={styles.userInfo}>
            <div className={styles.nameContainer}>
                <span className={styles.name}>{user.fullName || "Без имени"}</span>
                {user.legalName && (
                    <span className={styles.legalName}>{user.legalName}</span>
                )}
            </div>

            <div className={styles.email}>{user.email}</div>

            <div className={styles.status}>
        <span className={`${styles.statusBadge} ${user.banned ? styles.banned : styles.active}`}>
          {user.banned ? "Заблокирован" : "Активен"}
        </span>
            </div>

            <div className={styles.type}>
                {user.role === "Admin" && "Администратор"}
                {user.role === "Creator" && "Контент-мейкер"}
                {user.role === "User" && (user.legalId ? "Юр. лицо" : "Физ. лицо")}
            </div>
        </div>

        {user.legalId && (
            <div className={styles.legalInfo}>
                <span>ИНН: {user.legalId}</span>
            </div>
        )}
    </Link>
);