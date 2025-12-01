import {Link} from "react-router-dom"; // Если используете react-router-dom для навигации
import styles from "./breadcrumbs.module.sass";
import {memo} from "react";
import BreadcrumbsItemsSkeleton from "../skeletons/BreadcrumbsItemsSkeleton.tsx";

type ItemsBreadcrumbs = {
    path: string;
    label: string | React.ReactNode;
};

type Props = {
    items: ItemsBreadcrumbs[];
    isLoading: boolean;
};

export const Breadcrumbs = memo((props: Props) => {
    return (
        <nav aria-label="breadcrumb" className="mb-25">
            <ol className={`${styles["container"]} flex`}>
                {props.isLoading ? (
                    <>
                        <BreadcrumbsItemsSkeleton/>
                        <BreadcrumbsItemsSkeleton/>
                        <BreadcrumbsItemsSkeleton/>
                    </>
                ) : (
                    props.items.map((item, index) => (
                        <li key={index}>
                            {index !== props.items.length - 1 ? (
                                <Link to={item.path} className="color-gray">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="color-gray">{item.label}</span>
                            )}
                        </li>
                    ))
                )}
            </ol>
        </nav>
    );
});
