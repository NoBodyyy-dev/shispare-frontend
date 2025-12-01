import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks/state.hook.ts";
import {getAllRequestsFunc, answerRequestFunc} from "../../store/actions/request.action.ts";
import {IRequest} from "../../store/interfaces/request.interface.ts";
import {MainTextarea} from "../../lib/input/MainTextarea.tsx";
import {Button} from "../../lib/buttons/Button.tsx";
import {Modal} from "../../lib/modal/Modal.tsx";
import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import styles from "./requests.module.sass";

export const RequestsPage = () => {
    const dispatch = useAppDispatch();
    const {user, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const {requests, isLoadingRequests} = useAppSelector(state => state.request);
    const [selectedRequest, setSelectedRequest] = useState<IRequest | null>(null);
    const [answerText, setAnswerText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== "Admin") {
            navigate("/");
            return;
        }
        dispatch(getAllRequestsFunc());
    }, [isAuthenticated, user, navigate, dispatch]);

    const handleAnswerClick = (request: IRequest) => {
        setSelectedRequest(request);
        setAnswerText("");
    };

    const handleSubmitAnswer = async () => {
        if (!selectedRequest || !answerText.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(answerRequestFunc({
                id: selectedRequest._id,
                answer: answerText
            })).unwrap();
            setSelectedRequest(null);
            setAnswerText("");
            // Обновляем список заявок
            dispatch(getAllRequestsFunc());
        } catch (error) {
            console.error("Ошибка при отправке ответа:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const [activeTab, setActiveTab] = useState<"unanswered" | "answered">("unanswered");
    const unansweredRequests = requests.filter(r => !r.answered);
    const answeredRequests = requests.filter(r => r.answered);

    if (isLoadingRequests) {
        return (
            <div className="main__container">
                <div className={styles.loader}>Загрузка заявок...</div>
            </div>
        );
    }

    return (
        <div className={`main__container ${user?.role === "Admin" ? "p-20" : ""}`}>
            <h1 className={styles.title}>Заявки</h1>

            <div className={styles.tabs}>
                <div
                    className={`${styles.tab} ${activeTab === "unanswered" ? styles.active : ""}`}
                    onClick={() => setActiveTab("unanswered")}
                >
                    Неотвеченные ({unansweredRequests.length})
                </div>
                <div
                    className={`${styles.tab} ${activeTab === "answered" ? styles.active : ""}`}
                    onClick={() => setActiveTab("answered")}
                >
                    Отвеченные ({answeredRequests.length})
                </div>
            </div>

            <div className={styles.requestsList}>
                {activeTab === "unanswered" ? (
                    unansweredRequests.length > 0 ? (
                        unansweredRequests.map((request) => (
                            <div key={request._id} className={styles.requestCard}>
                                <div className={styles.requestHeader}>
                                    <div>
                                        <h3 className={styles.requestName}>{request.fullName}</h3>
                                        <p className={styles.requestEmail}>{request.email}</p>
                                    </div>
                                    <div className={styles.requestDate}>
                                        {new Date(request.createdAt).toLocaleString('ru-RU')}
                                    </div>
                                </div>
                                <div className={styles.requestQuestion}>
                                    <strong>Вопрос:</strong>
                                    <p>{request.question}</p>
                                </div>
                                <Button
                                    onClick={() => handleAnswerClick(request)}
                                    className={styles.answerButton}
                                >
                                    Ответить
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className={styles.empty}>Нет неотвеченных заявок</div>
                    )
                ) : (
                    answeredRequests.length > 0 ? (
                        answeredRequests.map((request) => (
                            <div key={request._id} className={`${styles.requestCard} ${styles.answered}`}>
                                <div className={styles.requestHeader}>
                                    <div>
                                        <h3 className={styles.requestName}>{request.fullName}</h3>
                                        <p className={styles.requestEmail}>{request.email}</p>
                                    </div>
                                    <div className={styles.requestDate}>
                                        {new Date(request.createdAt).toLocaleString('ru-RU')}
                                    </div>
                                </div>
                                <div className={styles.requestQuestion}>
                                    <strong>Вопрос:</strong>
                                    <p>{request.question}</p>
                                </div>
                                {request.answer && (
                                    <div className={styles.requestAnswer}>
                                        <strong>Ответ:</strong>
                                        <p>{request.answer}</p>
                                    </div>
                                )}
                                {request.answeredAt && (
                                    <div className={styles.answeredInfo}>
                                        Отвечено: {new Date(request.answeredAt).toLocaleString('ru-RU')}
                                        {request.answeredBy && typeof request.answeredBy === 'object' && ` (${request.answeredBy.fullName})`}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={styles.empty}>Нет отвеченных заявок</div>
                    )
                )}
            </div>

            <Modal modal={!!selectedRequest} setModal={() => setSelectedRequest(null)}>
                <div className={styles.modalContent}>
                    <h3 className={styles.modalTitle}>Ответить на заявку</h3>
                    {selectedRequest && (
                        <>
                            <div className={styles.modalInfo}>
                                <p><strong>От:</strong> {selectedRequest.fullName}</p>
                                <p><strong>Email:</strong> {selectedRequest.email}</p>
                                <p><strong>Вопрос:</strong></p>
                                <div className={styles.questionBox}>{selectedRequest.question}</div>
                            </div>
                            <div className={styles.answerSection}>
                                <label className={styles.label}>Ваш ответ:</label>
                                <MainTextarea
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    placeholder="Введите ответ на вопрос..."
                                    className={styles.answerTextarea}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <Button
                                    onClick={() => {
                                        setSelectedRequest(null);
                                        setAnswerText("");
                                    }}
                                    className={styles.cancelButton}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    onClick={handleSubmitAnswer}
                                    disabled={!answerText.trim() || isSubmitting}
                                    loading={isSubmitting}
                                    className={styles.submitButton}
                                >
                                    Отправить ответ
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

