import {FC, useEffect, useState} from "react";
import styles from "./blog.module.sass"
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {getAllPostsFunc} from "../../store/actions/blog.action.ts";
import {CreatePostForm} from "./CreatePostForm.tsx";
import {Post} from "./Post.tsx";
import {Modal} from "../../lib/modal/Modal.tsx";
import {TitleWithCreateButton} from "../../lib/title/TitleWithCreateButton.tsx";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import {SEO} from "../../lib/seo/SEO.tsx";
import {useAuth} from "../../context/AuthContext.tsx";

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
    const [openModal, setOpenModal] = useState(false);
    const {user} = useAuth()

    useEffect(() => {
        dispatch(getAllPostsFunc())
    }, []);

    return (
        <>
            <SEO
                title="Блог"
                description="Полезные статьи о строительных материалах, технологиях и новинках в сфере строительства и ремонта"
                keywords="блог, строительные материалы, статьи, новости строительства"
                url="/blog"
                type="website"
            />
            <div className={`main__container ${user?.role === "Admin" ? "p-20" : ""}`}>
                <Breadcrumbs items={breadcrumbsItems} isLoading={false}/>
            <div className="main__block">
                <TitleWithCreateButton title="Блог" openModal={setOpenModal} />
                <div className={styles.container}>
                    {errorPosts ? errorPosts
                        : isLoadingPosts ? "Загрузка" : posts.map((post) => {
                            return <Post {...post} key={post._id}/>
                        })}
                </div>
            </div>
            <Modal modal={openModal} setModal={setOpenModal}>
                <CreatePostForm/>
            </Modal>
        </div>
        </>
    )
}


