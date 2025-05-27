import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook";
import {getAllCategoriesFunc} from "../../store/actions/category.action";
import {Link} from "react-router-dom";
import Breadcrumbs from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import styles from "./product.page.module.sass"

export default function Categories() {
    const dispatch = useAppDispatch();
    const {categories, isLoadingCategory} = useAppSelector(
        (state) => state.category
    );

    const items = [
        {path: "/", label: "Главная"},
        {path: "/categories", label: "Категории"},
    ]

    useEffect(() => {
        dispatch(getAllCategoriesFunc());
        console.log(categories);
    }, [dispatch]);

    return (
        <div className={`main__container ${styles.category}`}>
            <Breadcrumbs items={items} isLoading={isLoadingCategory}/>
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
        </div>
    );
}
