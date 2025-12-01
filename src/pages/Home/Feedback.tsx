import {useState, FormEvent} from "react";
import {MainInput} from "../../lib/input/MainInput.tsx";
import {MainTextarea} from "../../lib/input/MainTextarea.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {createRequestFunc} from "../../store/actions/request.action.ts";
import {addMessage} from "../../store/slices/push.slice.ts";
import "./home.sass";

export const Feedback = () => {
    const dispatch = useAppDispatch();
    const {isLoadingCreateRequest} = useAppSelector(state => state.request);
    const [feedbackData, setFeedbackData] = useState({
        fullName: "",
        email: "",
        question: ""
    });
    const [errors, setErrors] = useState<{fullName?: string; email?: string; question?: string}>({});

    const validateForm = () => {
        const newErrors: {fullName?: string; email?: string; question?: string} = {};

        if (!feedbackData.fullName.trim()) {
            newErrors.fullName = "Имя обязательно для заполнения";
        }

        if (!feedbackData.email.trim()) {
            newErrors.email = "Email обязателен для заполнения";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedbackData.email)) {
            newErrors.email = "Некорректный email адрес";
        }

        if (!feedbackData.question.trim()) {
            newErrors.question = "Вопрос обязателен для заполнения";
        } else if (feedbackData.question.trim().length < 10) {
            newErrors.question = "Вопрос должен содержать минимум 10 символов";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await dispatch(createRequestFunc({
                fullName: feedbackData.fullName.trim(),
                email: feedbackData.email.trim(),
                question: feedbackData.question.trim()
            })).unwrap();

            dispatch(addMessage({
                text: "Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
                type: "success"
            }));

            // Очищаем форму
            setFeedbackData({
                fullName: "",
                email: "",
                question: ""
            });
            setErrors({});
        } catch (error: any) {
            dispatch(addMessage({
                text: error?.message || "Ошибка при отправке заявки. Попробуйте позже.",
                type: "error"
            }));
        }
    };

    return (
        <div className="feedback">
            <div className="feedback__block feedback__info">
                <div className="feedback__content">
                    <h2 className="feedback__title">Оставьте заявку</h2>
                    <p className="feedback__text">
                        У вас есть вопросы или нужна консультация? Наши специалисты готовы помочь вам выбрать 
                        подходящие строительные материалы и ответить на все ваши вопросы.
                    </p>
                </div>
            </div>
            <div className="feedback__block feedback__form">
                <form onSubmit={handleSubmit} className="feedback__form-content">
                    <MainInput
                        label="Ваше имя *"
                        value={feedbackData.fullName}
                        onChange={(e) => setFeedbackData({...feedbackData, fullName: e.target.value})}
                        placeholder="Введите ваше имя"
                        error={errors.fullName}
                        disabled={isLoadingCreateRequest}
                    />
                    <MainInput
                        label="Email *"
                        type="email"
                        value={feedbackData.email}
                        onChange={(e) => setFeedbackData({...feedbackData, email: e.target.value})}
                        placeholder="example@mail.com"
                        error={errors.email}
                        disabled={isLoadingCreateRequest}
                    />
                    <div className="feedback__textarea-wrapper">
                        <label className="feedback__textarea-label">Ваш вопрос *</label>
                        <MainTextarea
                            value={feedbackData.question}
                            onChange={(e) => setFeedbackData({...feedbackData, question: e.target.value})}
                            placeholder="Опишите ваш вопрос или задачу..."
                            disabled={isLoadingCreateRequest}
                            className={errors.question ? "feedback__textarea--error" : ""}
                        />
                        {errors.question && (
                            <p className="feedback__error-text">{errors.question}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        loading={isLoadingCreateRequest}
                        disabled={isLoadingCreateRequest}
                        className="feedback__submit-btn"
                    >
                        Отправить заявку
                    </Button>
                </form>
            </div>
        </div>
    );
};
