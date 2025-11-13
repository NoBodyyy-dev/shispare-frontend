import React from 'react';
import {CommentInterface} from '../../store/interfaces/comment.interface';
import {Link} from 'react-router-dom';
import styles from './comment.module.sass';

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
                    <Link 
                        to={`/lk/${comment.owner._id}`}
                        className={styles.userName}
                    >
                        {comment.owner.fullName || 'Пользователь'}
                    </Link>
                    <span className={styles.commentDate}>
                        {formatDate(comment.createdAt)}
                    </span>
                </div>
            </div>
            
            <div className={styles.commentContent}>
                <p>{comment.content}</p>
            </div>

            {comment.product && (
                <div className={styles.commentProduct}>
                    <Link 
                        to={`/product/${comment.product.slug || comment.product._id}`}
                        className={styles.productLink}
                    >
                        <span className={styles.productLabel}>Товар:</span>
                        <span className={styles.productName}>{comment.product.title}</span>
                    </Link>
                </div>
            )}
        </div>
    );
};

