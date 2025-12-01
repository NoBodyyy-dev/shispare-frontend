import React, {useState, useEffect} from "react";
import {useAppDispatch} from "../../hooks/state.hook.ts";
import {updatePostFunc, deletePostFunc} from "../../store/actions/blog.action.ts";
import {MainInput} from "../../lib/input/MainInput.tsx";
import {MainTextarea} from "../../lib/input/MainTextarea.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import {PostInterface} from "../../store/interfaces/blog.interface.ts";
import {useNavigate} from "react-router-dom";
import {ConfirmModal} from "../../lib/modal/ConfirmModal.tsx";
import {addMessage} from "../../store/slices/push.slice.ts";
import styles from "./blog.module.sass";

interface EditPostFormProps {
    post: PostInterface;
    onClose: () => void;
    onUpdate?: () => void;
}

export const EditPostForm: React.FC<EditPostFormProps> = ({post, onClose, onUpdate}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(post.image || null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        setTitle(post.title);
        setContent(post.content);
        setPreview(post.image || null);
        setImage(null);
        setErrors({});
    }, [post]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        if (!title || !content) {
            const newErrors: Record<string, string[]> = {};
            if (!title) newErrors.title = ["Заголовок обязателен"];
            if (!content) newErrors.content = ["Содержание обязательно"];
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const fileList = image ? {
                0: image,
                length: 1,
                item: () => image,
                [Symbol.iterator]: function* () {
                    yield image;
                }
            } as FileList : undefined;

            const result = await dispatch(updatePostFunc({
                id: post._id,
                title,
                content,
                image: fileList,
            }));

            if (updatePostFunc.rejected.match(result)) {
                const errorPayload = result.payload as any;
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
                    if (message.includes('title') || message.includes('заголовок')) {
                        serverErrors.title = [errorPayload.message];
                    } else if (message.includes('content') || message.includes('содержан')) {
                        serverErrors.content = [errorPayload.message];
                    } else {
                        serverErrors.title = [errorPayload.message];
                    }
                }
                
                setErrors(serverErrors);
            } else {
                onUpdate?.();
                onClose();
            }
        } catch (error) {
            console.error("Ошибка при обновлении поста:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            const result = await dispatch(deletePostFunc(post._id));
            if (deletePostFunc.fulfilled.match(result)) {
                dispatch(addMessage({text: "Пост успешно удален", type: "success"}));
                navigate('/blog');
            } else {
                dispatch(addMessage({text: "Ошибка при удалении поста", type: "error"}));
            }
        } catch (error) {
            console.error("Ошибка при удалении поста:", error);
            dispatch(addMessage({text: "Ошибка при удалении поста", type: "error"}));
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.title}>Редактировать пост</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Заголовок</label>
                    <MainInput
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) {
                                setErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.title;
                                    return newErrors;
                                });
                            }
                        }}
                        placeholder="Введите заголовок поста"
                        error={errors.title}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Содержание</label>
                    <MainTextarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            if (errors.content) {
                                setErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.content;
                                    return newErrors;
                                });
                            }
                        }}
                        placeholder="Введите текст поста"
                        required
                    />
                    {errors.content && (
                        <div className={styles.errorText}>
                            {errors.content.map((err, i) => (
                                <div key={i}>{err}</div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Изображение</label>
                    <label className={styles.fileInputLabel}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                handleImageChange(e);
                                if (errors.image) {
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.image;
                                        return newErrors;
                                    });
                                }
                            }}
                            className={styles.fileInput}
                        />
                        <span className={styles.fileInputText}>
                            {image ? `Выбрано: ${image.name}` : "Выберите новое изображение (необязательно)"}
                        </span>
                    </label>
                    {errors.image && (
                        <div className={styles.errorText}>
                            {errors.image.map((err, i) => (
                                <div key={i}>{err}</div>
                            ))}
                        </div>
                    )}
                    {preview && (
                        <div className={styles.preview}>
                            <img src={preview} alt="Preview" className={styles.previewImage} />
                        </div>
                    )}
                </div>

                <div className={styles.formActions}>
                    <Button 
                        type="button"
                        onClick={handleDeleteClick}
                        disabled={isDeleting || isSubmitting}
                        className={styles.deleteButton}
                    >
                        Удалить пост
                    </Button>
                    <div className={styles.submitButtons}>
                        <Button 
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting || isDeleting}
                            className={styles.cancelButton}
                        >
                            Отмена
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isSubmitting || isDeleting}
                            loading={isSubmitting}
                            className={styles.submitButton}
                        >
                            Сохранить изменения
                        </Button>
                    </div>
                </div>
            </form>
            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteConfirm}
                title="Удаление поста"
                message="Вы уверены, что хотите удалить этот пост? Это действие нельзя отменить."
                confirmText="Удалить"
                cancelText="Отмена"
                confirmButtonStyle="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};

