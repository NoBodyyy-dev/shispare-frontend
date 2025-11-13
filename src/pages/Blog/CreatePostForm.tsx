import React, {useState} from "react";
import {useAppDispatch} from "../../hooks/state.hook.ts";
import {createPostFunc} from "../../store/actions/blog.action.ts";
import {MainInput} from "../../lib/input/MainInput.tsx";
import {MainTextarea} from "../../lib/input/MainTextarea.tsx";
import styles from "./createPostForm.module.sass";
import {Button} from "../../lib/buttons/Button.tsx";

export const CreatePostForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

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
        if (!title || !content || !image) {
            alert("Заполните все поля");
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

        dispatch(createPostFunc({
            title,
            content,
            image: fileList,
        }));

        setTitle("");
        setContent("");
        setImage(null);
        setPreview(null);
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.title}>Создать пост</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Заголовок</label>
                    <MainInput
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Введите заголовок поста"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Содержание</label>
                    <MainTextarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Введите текст поста"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Изображение</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={styles.fileInput}
                        required
                    />
                    {preview && (
                        <div className={styles.preview}>
                            <img src={preview} alt="Preview" className={styles.previewImage} />
                        </div>
                    )}
                </div>

                <Button className="full-width">Создать пост</Button>
            </form>
        </div>
    );
};