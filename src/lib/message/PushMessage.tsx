import { motion, AnimatePresence } from 'framer-motion';
import styles from "./message.module.sass";
import { useAppDispatch, useAppSelector } from "../../hooks/state.hook.ts";
import { removeMessage } from "../../store/slices/push.slice.ts";
import { useEffect, useRef } from 'react';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

type MessageType = 'error' | 'success' | 'warning' | 'info';

const getMessageStyle = (type: MessageType) => {
    switch (type) {
        case 'error':
            return styles.pushMessageError;
        case 'success':
            return styles.pushMessageSuccess;
        case 'warning':
            return styles.pushMessageWarning;
        case 'info':
        default:
            return styles.pushMessageInfo;
    }
};

export const PushMessageList = () => {
    const dispatch = useAppDispatch();
    const { messages } = useAppSelector((state) => state.push);
    const timersRef = useRef<Record<string, number>>({});
    const duration = 5000; // ms

    useEffect(() => {
        return () => {
            Object.values(timersRef.current).forEach(timer => window.clearTimeout(timer));
        };
    }, []);

    useEffect(() => {
        messages.forEach(msg => {
            if (!timersRef.current[msg.id]) {
                timersRef.current[msg.id] = window.setTimeout(() => {
                    dispatch(removeMessage(msg.id));
                    delete timersRef.current[msg.id];
                }, duration);
            }
        });

        const currentIds = messages.map(msg => msg.id);
        Object.keys(timersRef.current).forEach(id => {
            if (!currentIds.includes(id)) {
                window.clearTimeout(timersRef.current[id]);
                delete timersRef.current[id];
            }
        });
    }, [messages, dispatch]);

    return (
        <div className={styles.pushContainer}>
            <AnimatePresence>
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                        className={`${styles.pushMessage} ${getMessageStyle(msg.type || 'info')} mb-5`}
                        layout
                    >
                        <div className={styles.pushLeftIcon} style={msg.type === 'error' ? { color: '#e74c3c' } : undefined}>
                            {msg.type === 'success' && <FaCheckCircle />}
                            {msg.type === 'info' && <FaInfoCircle />}
                            {msg.type === 'warning' && <FaExclamationTriangle />}
                            {msg.type === 'error' && <FaTimesCircle />}
                        </div>

                        <div className={styles.pushContent}>
                            {msg.text}
                        </div>

                        <div
                            className={styles.pushX}
                            onClick={() => {
                                window.clearTimeout(timersRef.current[msg.id]);
                                delete timersRef.current[msg.id];
                                dispatch(removeMessage(msg.id));
                            }}
                            aria-label="Закрыть сообщение"
                        >
                            ×
                        </div>

                        <div
                            className={styles.pushProgress}
                            style={{ animationDuration: `${duration}ms` }}
                            aria-hidden
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};