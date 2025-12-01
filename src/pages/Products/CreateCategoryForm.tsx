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
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

    const photoFile = watch('image');

    const onSubmit = async (data: CategoryFormData) => {
        if (!photoFile || photoFile.length === 0) {
            setSubmitError('Необходимо выбрать изображение');
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        setServerErrors({});

        try {
            const imageFormData = new FormData();
            imageFormData.append('image', photoFile[0]);
            const result = await dispatch(createCategoryFunc({
                title: data.title,
                image: photoFile[0].name
            }));

            if (createCategoryFunc.fulfilled.match(result)) {
                reset();
                setServerErrors({});
                addMessage('Категория успешно создана');
            } else if (createCategoryFunc.rejected.match(result)) {
                const errorPayload = result.payload as any;
                const errors: Record<string, string[]> = {};
                
                if (errorPayload?.errors && typeof errorPayload.errors === 'object') {
                    Object.keys(errorPayload.errors).forEach((field) => {
                        const fieldErrors = errorPayload.errors[field];
                        if (Array.isArray(fieldErrors)) {
                            errors[field] = fieldErrors;
                        } else if (typeof fieldErrors === 'string') {
                            errors[field] = [fieldErrors];
                        }
                    });
                } else if (errorPayload?.message) {
                    const message = errorPayload.message.toLowerCase();
                    if (message.includes('title') || message.includes('назван')) {
                        errors.title = [errorPayload.message];
                    } else if (message.includes('image') || message.includes('изображен')) {
                        errors.image = [errorPayload.message];
                    } else {
                        errors.title = [errorPayload.message];
                    }
                }
                
                setServerErrors(errors);
                addMessage(errorPayload?.message || 'Ошибка при создании категории', 'error');
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
                    error={serverErrors.title || (errors.title ? [errors.title.message || ''] : undefined)}
                    {...register('title', {
                        required: 'Название обязательно',
                        minLength: {
                            value: 3,
                            message: 'Минимум 3 символа'
                        },
                        onChange: () => {
                            if (serverErrors.title) {
                                setServerErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.title;
                                    return newErrors;
                                });
                            }
                        }
                    })}
                />
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
                loading={isSubmitting}
                disabled={isSubmitting}
            >
                Создать категорию
            </Button>
        </form>
    );
};