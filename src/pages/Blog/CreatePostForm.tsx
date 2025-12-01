import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {createPostFunc} from "../../store/actions/blog.action.ts";
import {MainInput} from "../../lib/input/MainInput.tsx";
import {MainTextarea} from "../../lib/input/MainTextarea.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import styles from "./blog.module.sass";

export const CreatePostForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const {isLoadingEventPosts} = useAppSelector(state => state.blog);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

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
        
        if (!title || !content || !image) {
            const newErrors: Record<string, string[]> = {};
            if (!title) newErrors.title = ["Заголовок обязателен"];
            if (!content) newErrors.content = ["Содержание обязательно"];
            if (!image) newErrors.image = ["Изображение обязательно"];
            setErrors(newErrors);
            return;
        }

        const fileList = {
            0: image,
            length: 1,
            item: () => image,
            [Symbol.iterator]: function* () {
                yield image;
            }
        } as FileList;

        const result = await dispatch(createPostFunc({
            title,
            content,
            image: fileList,
        }));

        if (createPostFunc.rejected.match(result)) {
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
                } else if (message.includes('image') || message.includes('изображен')) {
                    serverErrors.image = [errorPayload.message];
                } else {
                    serverErrors.title = [errorPayload.message];
                }
            }
            
            setErrors(serverErrors);
            return;
        }

        if (createPostFunc.fulfilled.match(result)) {
            setTitle("");
            setContent("");
            setImage(null);
            setPreview(null);
            setErrors({});
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.title}>Создать пост</h2>
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
                            required
                        />
                        <span className={styles.fileInputText}>
                            {image ? `Выбрано: ${image.name}` : "Выберите изображение или перетащите файл сюда"}
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

                <Button 
                    className="full-width"
                    type="submit"
                    loading={isLoadingEventPosts}
                    disabled={isLoadingEventPosts}
                >
                    Создать пост
                </Button>
            </form>
        </div>
    );
};