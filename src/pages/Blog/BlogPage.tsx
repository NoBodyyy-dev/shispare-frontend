import {FC, useEffect, useState} from "react";
import styles from "./blog.module.sass"
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {getAllPostsFunc} from "../../store/actions/blog.action.ts";
import {CreatePostForm} from "./CreatePostForm.tsx";
import {Post} from "./Post.tsx";
import {Modal} from "../../lib/modal/Modal.tsx";
import {TitleWithCreateButton} from "../../lib/title/TitleWithCreateButton.tsx";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";

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

    useEffect(() => {
        dispatch(getAllPostsFunc())
    }, []);

    return (
        <div className="main__container">
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
    )
}


