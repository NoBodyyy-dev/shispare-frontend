import React from 'react';
import {CommentInterface} from '../../store/interfaces/comment.interface';
import styles from './comment.module.sass';
import {StarRating} from "../products/StarRating.tsx";

type Props = {
    comment: CommentInterface;
}

export const CommentCard: React.FC<Props> = ({comment}) => {
    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return d.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.commentCard}>
            <div className={styles.commentHeader}>
                <div className={styles.userInfo}>
                    {comment.owner.fullName || 'Удаленный пользователь'}
                    <span className={styles.commentDate}>
                        {formatDate(comment.createdAt)}
                    </span>
                </div>
                <StarRating rating={comment.rating} totalComments={null} />
            </div>

            <div className={styles.commentContent}>
                <p>{comment.content}</p>
            </div>
        </div>
    );
};