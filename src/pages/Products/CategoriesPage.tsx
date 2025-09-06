import {FC, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook";
import {getAllCategoriesFunc} from "../../store/actions/category.action";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {useAuth} from "../../context/AuthContext.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import {Modal} from "../../lib/modal/Modal.tsx";
import {CreateCategoryForm} from "./CreateCategoryForm.tsx";
import styles from "./product.page.module.sass"

export const Categories: FC = () => {
    const dispatch = useAppDispatch();
    const {categories, isLoadingCategory} = useAppSelector(
        (state) => state.category
    );
    const {user, isAuthenticated} = useAuth();
    const [openModal, setOpenModal] = useState<boolean>(false);

    const items = [
        {path: "/", label: "Главная"},
        {path: "/categories", label: "Категории"},
    ]

    useEffect(() => {
        dispatch(getAllCategoriesFunc());
    }, [dispatch]);

    return (
        <div className={`main__container ${styles.category}`}>
            <Breadcrumbs items={items} isLoading={isLoadingCategory}/>
            {
                (isAuthenticated && user?.role === "Admin")
                    ? <div className="flex-align-start-sbetw">
                        <h1 className="title mb-20">Категории</h1>
                        <Button
                            className="fz-20"
                            onClick={() => setOpenModal(true)}
                        >+</Button>
                    </div>
                    : <h1 className="title mb-20">Категории</h1>
            }
            <div className={styles.categoryContainer}>
                {categories.map((category) => {
                    return (<Link to={`/categories/${category.slug}`}>
                            <div key={category._id} className={`${styles.categoryItem} flex-to-center-col`}>
                                <img src={category.image} alt={category.title}/>
                                <p className="fz-18 center mt-20">{category.title}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
            {
                openModal
                && <Modal modal={openModal} setModal={setOpenModal}>
                    <CreateCategoryForm/>
                </Modal>
            }
        </div>
    );
}
