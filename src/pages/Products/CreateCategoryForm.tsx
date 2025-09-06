import {useState} from "react";
import {useForm} from 'react-hook-form';
import {MainInput} from '../../lib/input/MainInput';
import {Button} from '../../lib/buttons/Button';
import {useAppDispatch} from "../../hooks/state.hook.ts";
import {createCategoryFunc} from "../../store/actions/category.action.ts";
import {addMessage} from "../../store/slices/push.slice.ts"
import styles from "./product.page.module.sass"

type CategoryFormData = {
    title: string;
    image: FileList | null;
};

export const CreateCategoryForm = () => {
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        formState: {errors},
        watch,
        reset
    } = useForm<CategoryFormData>();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const photoFile = watch('image');

    const onSubmit = async (data: CategoryFormData) => {
        if (!photoFile || photoFile.length === 0) {
            setSubmitError('Необходимо выбрать изображение');
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const imageFormData = new FormData();
            imageFormData.append('image', photoFile[0]);
            const result = await dispatch(createCategoryFunc({
                title: data.title,
                image: photoFile[0].name
            }));

            if (createCategoryFunc.fulfilled.match(result)) {
                reset();
                addMessage('Категория успешно создана');
            } else if (createCategoryFunc.rejected.match(result)) {
                addMessage(result.payload as string || 'Ошибка при создании категории', 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : 'Произошла неизвестная ошибка'
            );
            addMessage('Ошибка при загрузке изображения', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                    Название категории
                </label>
                <MainInput
                    id="title"
                    placeholder="Введите название категории"
                    {...register('title', {
                        required: 'Название обязательно',
                        minLength: {
                            value: 3,
                            message: 'Минимум 3 символа'
                        },
                    })}
                />
                {errors.title && <span className={styles.error}>{errors.title.message}</span>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="image" className={styles.label}>
                    Фотография категории
                </label>
                <div className={styles.fileInputWrapper}>
                    <label className={styles.fileInputLabel}>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            className={styles.fileInput}
                            {...register('image')}
                        />
                        <span className={styles.fileInputButton}>
              {photoFile?.length ? 'Файл выбран' : 'Выберите файл'}
            </span>
                        {photoFile?.length && (
                            <span className={styles.fileName}>
                {photoFile[0].name}
              </span>
                        )}
                    </label>
                </div>
            </div>

            <Button
                type="submit"
                className="full-width"
            >
                Создать категорию
            </Button>
        </form>
    );
};