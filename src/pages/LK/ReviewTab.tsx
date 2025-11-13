import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import styles from "./lk.module.sass";
import {useEffect} from "react";
import {getUserCommentsFunc} from "../../store/actions/comment.action.ts";
import {useParams} from "react-router-dom";
import {CommentCard} from "../../lib/comments/CommentCard.tsx";

export const ReviewsTab = () => {
    const dispatch = useAppDispatch();
    const {comments, isLoadingComments} = useAppSelector(state => state.comment);
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            dispatch(getUserCommentsFunc(params.id));
        }
    }, [params.id]);

    if (isLoadingComments) {
        return (
            <section className={styles.reviewsSection}>
                <div className={styles.loader}>Загрузка отзывов...</div>
            </section>
        );
    }

    return (
        <section className={styles.reviewsSection}>
            <h1 className="title">Отзывы</h1>
            {comments && comments.length > 0 ? (
                <div className={styles.reviewsList}>
                    {comments.map(comment => (
                        <CommentCard key={comment._id} comment={comment} />
                    ))}
                </div>
            ) : (
                <p className={styles.noOrders}>Отзывы не найдены.</p>
            )}
        </section>
    );
};