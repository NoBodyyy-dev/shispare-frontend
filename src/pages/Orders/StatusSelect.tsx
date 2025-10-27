import {useState} from "react";
import {OrderStatus} from "../../store/interfaces/order.interface.ts";
import styles from "./orders.module.sass";
import {MainTextarea} from "../../lib/input/MainTextarea.tsx";
import {Modal} from "../../lib/modal/Modal.tsx";

type Props = {
    current: OrderStatus;
    onChange: (status: OrderStatus) => void;
    disabled?: boolean;
};

const STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
    {label: "В ожидании", value: OrderStatus.PENDING},
    {label: "Подтвержден", value: OrderStatus.CONFIRMED},
    {label: "Отправлен", value: OrderStatus.SHIPPED},
    {label: "Доставлен", value: OrderStatus.DELIVERED},
    {label: "Отменен", value: OrderStatus.CANCELLED},
    {label: "Возвращен", value: OrderStatus.REFUNDED},
];

const NEXT_STATUSES: Record<OrderStatus, OrderStatus[] | null> = {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.REFUNDED],
    [OrderStatus.PROCESSING]: null,
    [OrderStatus.DELIVERED]: null,
    [OrderStatus.CANCELLED]: null,
    [OrderStatus.REFUNDED]: null,
};

const getStatusLabel = (status: OrderStatus) =>
    STATUS_OPTIONS.find(opt => opt.value === status)?.label || status;

export const StatusSelect = ({current, onChange, disabled}: Props) => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
    const [showConfirmedModal, setShowConfirmedModal] = useState(false);
    const [showCancelledModal, setShowCancelledModal] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("");
    const [cancellationReason, setCancellationReason] = useState("");

    const availableNextStatuses = NEXT_STATUSES[current];

    const handleStatusChange = (status: OrderStatus) => {
        if (status === OrderStatus.CONFIRMED) {
            setSelectedStatus(status);
            setShowConfirmedModal(true);
        } else if (status === OrderStatus.CANCELLED) {
            setSelectedStatus(status);
            setShowCancelledModal(true);
        } else {
            onChange(status);
        }
    };

    const handleConfirmDelivery = () => {
        if (selectedStatus) {
            onChange(selectedStatus);
            setShowConfirmedModal(false);
        }
    };

    const handleConfirmCancellation = () => {
        if (selectedStatus && cancellationReason.trim()) {
            onChange(selectedStatus);
            setShowCancelledModal(false);
            console.log("Cancellation reason:", cancellationReason);
        }
    };

    // Для конечных статусов показываем только текст
    if (availableNextStatuses === null) {
        return (
            <div className={styles.statusLabel}>
                {getStatusLabel(current)}
            </div>
        );
    }

    return (
        <>
            <select
                className={styles.select}
                value={current}
                disabled={disabled}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            >
                <option value={current} hidden>
                    {getStatusLabel(current)}
                </option>
                {availableNextStatuses.map((status) => (
                    <option key={status} value={status}>
                        {getStatusLabel(status)}
                    </option>
                ))}
            </select>

            <Modal modal={showConfirmedModal} setModal={setShowConfirmedModal}>
                <div className={styles.modalContent}>
                    <h3>Подтверждение заказа</h3>
                    <div className={styles.formGroup}>
                        <label>Дата доставки:</label>
                        <input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Время доставки:</label>
                        <input
                            type="time"
                            value={deliveryTime}
                            onChange={(e) => setDeliveryTime(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.modalActions}>
                        <button
                            onClick={() => setShowConfirmedModal(false)}
                            className={styles.secondaryButton}
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleConfirmDelivery}
                            disabled={!deliveryDate || !deliveryTime}
                            className={styles.primaryButton}
                        >
                            Подтвердить
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal modal={showCancelledModal} setModal={setShowCancelledModal}>
                <div className={styles.modalContent}>
                    <h3>Причина отмены заказа</h3>
                    <div className={styles.formGroup}>
                        <MainTextarea
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            placeholder="Укажите причину отмены заказа..."
                            className={styles.textarea}
                        />
                    </div>
                    <div className={styles.modalActions}>
                        <button
                            onClick={() => setShowCancelledModal(false)}
                            className={styles.secondaryButton}
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleConfirmCancellation}
                            disabled={!cancellationReason.trim()}
                            className={styles.primaryButton}
                        >
                            Подтвердить отмену
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};