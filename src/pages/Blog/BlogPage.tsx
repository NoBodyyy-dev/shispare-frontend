import Breadcrumbs from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {FC, useEffect} from "react";
import styles from "./blog.module.sass"
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {getAllPostsFunc} from "../../store/actions/blog.action.ts";
import {useHandleDate} from "../../hooks/util.hook.ts";
import {useNavigate} from "react-router-dom";

export const Blog: FC = () => {
    const breadcrumbsItems = [
        {
            path: "/",
            label: "Главная"
        },
        {
            path: `/blog`,
            label: "Блог",
        },
    ];

    const dispatch = useAppDispatch();
    const {posts, isLoadingPosts, errorPosts} = useAppSelector(state => state.blog)

    const handleDate = useHandleDate();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllPostsFunc())
    }, []);

    return (
        <div className="main__container">
            <Breadcrumbs items={breadcrumbsItems} isLoading={false}/>
            <div className="main__block">
                <h1 className="title mb-25">О компании</h1>
                <div className={styles.blog__container}>

                    {errorPosts ? errorPosts
                        : isLoadingPosts ? "Загрузка" : posts.map((post) => {
                            return <div className={`${styles.blog__post} p-20`} key={post._id}
                                        onClick={() => navigate(`/blog/${post.slug}`)}>
                                <img src={post.image} alt={post.title}/>
                                <div className={styles.blog__post__content}>
                                    <span className="color-gray fz-12">{handleDate(post.updatedAt!)}</span>
                                    <h2 className="subtitle">post.title</h2>
                                    <p className={`${styles.blog__post__description} fz-14`}>post.description</p>
                                </div>
                            </div>
                        })}
                </div>
            </div>
        </div>
    )
}
