import React from "react";
import {Modal} from "./Modal.tsx";
import {Button} from "../buttons/Button.tsx";
import styles from "./confirmModal.module.sass";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonStyle?: "danger" | "primary";
    isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Подтверждение",
    message,
    confirmText = "Подтвердить",
    cancelText = "Отмена",
    confirmButtonStyle = "primary",
    isLoading = false,
}) => {
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Modal modal={isOpen} setModal={onClose}>
            <div className={styles.confirmModal}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                        className={styles.cancelButton}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        loading={isLoading}
                        className={`${styles.confirmButton} ${styles[confirmButtonStyle]}`}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

