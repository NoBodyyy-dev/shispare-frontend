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
        {path: "/catalog", label: "Каталог"},
    ]

    useEffect(() => {
        dispatch(getAllCategoriesFunc());
    }, [dispatch]);

    return (
        <div className={`main__container ${styles.category}`}>
            <Breadcrumbs items={items} isLoading={isLoadingCategory}/>
            <h1 className="title mb-20">Категории</h1>
            <div className={styles.categoryContainer}>
                {categories && Array.isArray(categories) && categories.length > 0
                    ? categories.map((category) => {
                        return (<Link key={category._id} to={`/catalog/${category.slug}`}>
                                <div className={`${styles.categoryItem} flex-to-center-col`}>
                                    <p className="fz-18 center mt-20">{category.title}</p>
                                </div>
                            </Link>
                        );
                    })
                    : <p className="text-center color-gray">Категории не найдены</p>
                }
            </div>
        </div>
    );
}
