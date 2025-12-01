import {FC, useEffect, useState, useCallback, useMemo, ChangeEvent} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {getAllStaffFunc} from "../../store/actions/user.action.ts";
import {Link} from "react-router-dom";
import styles from "./staff.module.sass";
import {FiSearch} from "react-icons/fi";
import {UserInterface} from "../../store/interfaces/user.interface.ts";
import {MainInput} from "../../lib/input/MainInput.tsx";

export const StaffPage: FC = () => {
    const dispatch = useAppDispatch();
    const {staff, isLoadingStaff, errorStaff} = useAppSelector(s => s.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        dispatch(getAllStaffFunc());
    }, []);

    const handleSearchChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
        },
        []
    );

    const filteredStaff = useMemo(() => {
        if (!searchTerm.trim()) return staff;

        const term = searchTerm.toLowerCase();
        return staff.filter(user =>
            (user.fullName?.toLowerCase().includes(term)) ||
            (user.email?.toLowerCase().includes(term))
        );
    }, [staff, searchTerm]);

    const getRoleLabel = (role?: string) => {
        switch (role) {
            case "Admin":
                return "Администратор";
            case "Creator":
                return "Контент-мейкер";
            default:
                return role || "Неизвестно";
        }
    };

    if (errorStaff) {
        return (
            <div className="main__container p-20">
                <div className={styles.error}>
                    Ошибка загрузки сотрудников: {errorStaff}
                </div>
            </div>
        );
    }

    return (
        <div className="main__container p-20">
            <h1 className="title mb-20">Сотрудники</h1>

            <div className="main__block">
                <div className={`${styles.searchContainer} ${isSearchFocused ? styles.focused : ""}`}>
                    <FiSearch className={styles.searchIcon}/>
                    <MainInput
                        type="text"
                        placeholder="Поиск по имени или email..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className={`full-width border-none`}
                    />
                </div>

                {isLoadingStaff ? (
                    <div className={styles.loader}>Загрузка сотрудников...</div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Сотрудник</th>
                                    <th>Email</th>
                                    <th>Роль</th>
                                    <th>Статус</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className={styles.noResults}>
                                            Сотрудники не найдены
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStaff.map(user => (
                                        <tr key={user._id} className={styles.tableRow}>
                                            <td>
                                                <Link to={`/lk/${user._id}`} className={styles.userLink}>
                                                    <div className={styles.name}>{user.fullName || "Без имени"}</div>
                                                </Link>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={styles.roleBadge}>
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${user.banned ? styles.banned : styles.active}`}>
                                                    {user.banned ? "Заблокирован" : "Активен"}
                                                </span>
                                            </td>
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


