import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import styles from "./lk.module.sass";
import {useEffect} from "react";
import {getUserCommentsFunc} from "../../store/actions/comment.action.ts";
import {useParams} from "react-router-dom";

export const ReviewsTab = () => {
    const dispatch = useAppDispatch();
    const {comments} = useAppSelector(state => state.comment);
    const params = useParams()

    useEffect(() => {
       dispatch(getUserCommentsFunc(params.id!))
    }, []);

    return (
        <section className={styles.reviewsSection}>
            <h1 className="title">Мои отзывы</h1>
            {comments?.length ? (
                <ul className={styles.reviewList}>
                    {comments.map(c => (
                        <li key={c._id} className={styles.reviewItem}>
                            {c.content}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.noOrders}>Вы ещё не оставили отзывов.</p>
            )}
        </section>
    );
};