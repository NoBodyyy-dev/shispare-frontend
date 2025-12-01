import {FC, useEffect, useState} from "react";
import styles from "./solution.module.sass"
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {SolutionPreview} from "./SolutionPreview.tsx";
import {getAllSolutionsFunc} from "../../store/actions/solution.action.ts";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {TitleWithCreateButton} from "../../lib/title/TitleWithCreateButton.tsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";

export const SolutionsPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {user} = useAuth()
    const {solutions, isLoadingSolutions} = useAppSelector(state => state.solution);
    const [openModal, setOpenModal] = useState(false);

    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: "/solution", label: "Решения для дома"},
    ]

    useEffect(() => {
        dispatch(getAllSolutionsFunc())
    }, []);

    useEffect(() => {
        if (openModal) {
            navigate("/admin/create-solution");
            setOpenModal(false);
        }
    }, [openModal, navigate]);

    return (
        <div className={`main__container ${user?.role === "Admin" ? "p-20" : ""}`}>
            <Breadcrumbs items={breadcrumbsItems} isLoading={false}/>
            <TitleWithCreateButton title="Решения для дома" openModal={setOpenModal}/>
            <div className={styles.grid}>
                {isLoadingSolutions
                    ? "Загрузка..."
                    : solutions.length
                        ? solutions.map((solution) => {
                            return <SolutionPreview key={solution._id} solution={solution}/>
                        }) : "Нет решений"}
            </div>
        </div>
    );
}