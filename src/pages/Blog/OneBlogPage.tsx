import React, {useEffect, useState} from 'react';
import {TitleWithCreateButton} from "../../lib/title/TitleWithCreateButton.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {useParams} from "react-router-dom";
import {getCurrentPostFunc} from "../../store/actions/blog.action.ts";
import {Breadcrumbs} from "../../lib/breadcrumbs/Breadcrumbs.tsx";
import styles from "./blog.module.sass"
import {Modal} from "../../lib/modal/Modal.tsx";

export const OneBlog: React.FC = () => {
    const dispatch = useAppDispatch();
    const {currentPost, isLoadingCurrentPost, errorCurrentPost} = useAppSelector(state => state.blog);
    const params = useParams();
    const [openModal, setOpenModal] = useState(false);

    const breadcrumbsItems = [
        {path: "/", label: "Главная"},
        {path: `/blog`, label: "Блог"},
        {path: `/blog/${currentPost?.slug}`, label: currentPost?.title},
    ];

    useEffect(() => {
        dispatch(getCurrentPostFunc(params.slug!))
    }, [])

    if (isLoadingCurrentPost) return <>Загрузка</>;
    if (errorCurrentPost) return errorCurrentPost;
    if (!currentPost && !isLoadingCurrentPost) return <div>Пост не найден</div>

    const finalText = currentPost!.content.split("\n")

    return (
        <div className="main__container">
            <Breadcrumbs items={breadcrumbsItems} isLoading={isLoadingCurrentPost}/>
            <TitleWithCreateButton title={"Статья"} openModal={setOpenModal}/>
            <article className={styles.article}>
                <h2 className="subtitle mb-15">{currentPost!.title}</h2>

                <div className={styles.wrapper}>
                    <img
                        src={currentPost!.image}
                        alt="Технологии"
                        className={styles.image}
                    />

                    <div className={`${styles.text}`}>
                        {finalText.map((t, index) => {
                            return <p className="fz-16 font-roboto" key={`text-${index}`}>{t}</p>
                        })}
                    </div>
                </div>
            </article>
            <Modal modal={openModal} setModal={setOpenModal}>
                <>Пенис</>
            </Modal>
        </div>
    );
};
