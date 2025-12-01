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
            <div className="main__container p-20">
                <div className={styles.error}>
                    Ошибка загрузки пользователей: {errorUsers}
                </div>
            </div>
        );
    }

    return (
        <div className="main__container p-20">
            <h1 className="title mb-20">Пользователи</h1>

            <div className="main__block">
                <div className={`${styles.searchContainer} ${isSearchFocused ? styles.focused : ""}`}>
                    <FiSearch className={styles.searchIcon}/>
                    <MainInput
                        type="text"
                        placeholder="Поиск по имени, email или ИНН..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className={`full-width border-none`}
                    />
                </div>

                {isLoadingUsers ? (
                    <div className={styles.loader}>Загрузка пользователей...</div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Пользователь</th>
                                    <th>Email</th>
                                    <th>Статус</th>
                                    <th>Тип</th>
                                    <th>ИНН</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className={styles.noResults}>
                                            Пользователи не найдены
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <tr key={user._id} className={styles.tableRow}>
                                            <td>
                                                <Link to={`/lk/${user._id}`} className={styles.userLink}>
                                                    <div>
                                                        <div className={styles.name}>{user.fullName || "Без имени"}</div>
                                                        {user.legalName && (
                                                            <div className={styles.legalName}>{user.legalName}</div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${user.banned ? styles.banned : styles.active}`}>
                                                    {user.banned ? "Заблокирован" : "Активен"}
                                                </span>
                                            </td>
                                            <td>
                                                {user.legalId ? "Юр. лицо" : "Физ. лицо"}
                                            </td>
                                            <td>{user.legalId || "-"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};