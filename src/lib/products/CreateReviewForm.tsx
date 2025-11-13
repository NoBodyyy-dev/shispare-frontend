import {FC, useState, FormEvent} from "react";
import {StarRatingSelect} from "./StarRatingSelect";
import {MainTextarea} from "../input/MainTextarea";
import {Button} from "../buttons/Button";
import styles from "./createReviewForm.module.sass";

interface CreateReviewFormProps {
    productId: string;
    onSubmit: (data: {rating: number; text: string}) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const CreateReviewForm: FC<CreateReviewFormProps> = ({
    productId,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!text.trim()) {
            setError("Пожалуйста, напишите отзыв");
            return;
        }

        if (rating < 1 || rating > 5) {
            setError("Пожалуйста, выберите оценку");
            return;
        }

        try {
            await onSubmit({rating, text: text.trim()});
            setText("");
            setRating(5);
        } catch (err: any) {
            setError(err?.message || "Ошибка при отправке отзыва");
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.title}>Оставить отзыв</h3>

            <div className={styles.ratingSection}>
                <label className={styles.label}>Ваша оценка:</label>
                <StarRatingSelect rating={rating} onRatingChange={setRating} size={32} />
            </div>

            <div className={styles.textSection}>
                <label className={styles.label}>Ваш отзыв:</label>
                <MainTextarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Напишите ваш отзыв о товаре..."
                    className={styles.textarea}
                    required
                />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.actions}>
                <Button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className={styles.cancelButton}
                >
                    Отмена
                </Button>
                <Button
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading || !text.trim()}
                    className={styles.submitButton}
                >
                    Отправить отзыв
                </Button>
            </div>
        </form>
    );
};

