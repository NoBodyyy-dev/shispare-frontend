import {useState, FormEvent} from "react";
import {MainInput} from "../../lib/input/MainInput.tsx";
import {MainTextarea} from "../../lib/input/MainTextarea.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import {useAppDispatch} from "../../hooks/state.hook.ts";
import {createRequestFunc} from "../../store/actions/request.action.ts";
import "./home.sass"

export const Feedback = () => {
    const dispatch = useAppDispatch();
    const [feedbackData, setFeedbackData] = useState({
        fullName: "",
        email: "",
        question: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!feedbackData.fullName.trim() || !feedbackData.email.trim() || !feedbackData.question.trim()) {
            setError("Все поля обязательны для заполнения");
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(createRequestFunc(feedbackData)).unwrap();
            setSuccess(true);
            setFeedbackData({fullName: "", email: "", question: ""});
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            setError(err.message || "Ошибка при отправке заявки");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="feedback">
            <div className="feedback__block p-30">
                <div className="feedback__info">
                    <h2 className="feedback__title">Остались вопросы?</h2>
                    <p className="feedback__text">
                        Мы всегда готовы помочь вам! Оставьте заявку, и наш специалист свяжется с вами в ближайшее время.
                    </p>
                    <div className="feedback__note">
                        <p>⏱️ Среднее время ответа: <strong>в течение 24 часов</strong></p>
                        <p>📧 Ответ придет на указанный email адрес</p>
                    </div>
                </div>
            </div>
            <div className="feedback__block p-30">
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom: "20px"}}>
                        <label style={{display: "block", marginBottom: "8px", fontWeight: 500}}>
                            ФИО
                        </label>
                        <MainInput
                            value={feedbackData.fullName}
                            onChange={(e) => setFeedbackData({...feedbackData, fullName: e.target.value})}
                            placeholder="Введите ваше ФИО"
                            required
                        />
                    </div>
                    <div style={{marginBottom: "20px"}}>
                        <label style={{display: "block", marginBottom: "8px", fontWeight: 500}}>
                            Email
                        </label>
                        <MainInput
                            type="email"
                            value={feedbackData.email}
                            onChange={(e) => setFeedbackData({...feedbackData, email: e.target.value})}
                            placeholder="Введите ваш email"
                            required
                        />
                    </div>
                    <div style={{marginBottom: "20px"}}>
                        <label style={{display: "block", marginBottom: "8px", fontWeight: 500}}>
                            Ваш вопрос
                        </label>
                        <MainTextarea
                            value={feedbackData.question}
                            onChange={(e) => setFeedbackData({...feedbackData, question: e.target.value})}
                            placeholder="Опишите ваш вопрос..."
                            required
                        />
                    </div>
                    {error && (
                        <div style={{color: "#e74c3c", marginBottom: "15px", fontSize: "14px"}}>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div style={{color: "#2ecc71", marginBottom: "15px", fontSize: "14px"}}>
                            Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
                        </div>
                    )}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        className="full-width"
                    >
                        Отправить заявку
                    </Button>
                </form>
            </div>
        </div>
    );
};
