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
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        const validationErrors: Record<string, string[]> = {};
        
        if (!text.trim()) {
            validationErrors.text = ["Пожалуйста, напишите отзыв"];
        }

        if (rating < 1 || rating > 5) {
            validationErrors.rating = ["Пожалуйста, выберите оценку"];
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await onSubmit({rating, text: text.trim()});
            setText("");
            setRating(5);
            setErrors({});
        } catch (err: any) {
            const errorPayload = err?.payload || err?.response?.data || err;
            const serverErrors: Record<string, string[]> = {};
            
            if (errorPayload?.errors && typeof errorPayload.errors === 'object') {
                Object.keys(errorPayload.errors).forEach((field) => {
                    const fieldErrors = errorPayload.errors[field];
                    if (Array.isArray(fieldErrors)) {
                        serverErrors[field] = fieldErrors;
                    } else if (typeof fieldErrors === 'string') {
                        serverErrors[field] = [fieldErrors];
                    }
                });
            } else if (errorPayload?.message) {
                const message = errorPayload.message.toLowerCase();
                if (message.includes('content') || message.includes('текст') || message.includes('отзыв')) {
                    serverErrors.text = [errorPayload.message];
                } else if (message.includes('rating') || message.includes('оценк')) {
                    serverErrors.rating = [errorPayload.message];
                } else {
                    serverErrors.text = [errorPayload.message];
                }
            } else {
                const errorMessage = err?.response?.data?.message 
                    || err?.payload?.message 
                    || err?.message 
                    || (typeof err === 'string' ? err : "Ошибка при отправке отзыва");
                serverErrors.text = [errorMessage];
            }
            
            setErrors(serverErrors);
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
                    onChange={(e) => {
                        setText(e.target.value);
                        if (errors.text) {
                            setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.text;
                                return newErrors;
                            });
                        }
                    }}
                    placeholder="Напишите ваш отзыв о товаре..."
                    className={styles.textarea}
                    required
                />
                {errors.text && (
                    <div className={styles.errorText}>
                        {errors.text.map((err, i) => (
                            <div key={i}>{err}</div>
                        ))}
                    </div>
                )}
            </div>

            {errors.rating && (
                <div className={styles.errorText}>
                    {errors.rating.map((err, i) => (
                        <div key={i}>{err}</div>
                    ))}
                </div>
            )}

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



