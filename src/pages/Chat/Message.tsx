import React, {useEffect, useRef, useState} from "react";
import {useSocket} from "../../context/SocketContext";
import {IMessage} from "../../store/interfaces/socket.interface";
import {useAuth} from "../../context/AuthContext";
import {useLocaleTime} from "../../hooks/util.hook.ts";
import {ConfirmModal} from "../../lib/modal/ConfirmModal.tsx";
import styles from "./chat.module.sass";
import {GoPencil} from "react-icons/go";
import {MdContentCopy, MdOutlineDeleteOutline} from "react-icons/md";
import {CiCircleInfo} from "react-icons/ci";
import {BsReply} from "react-icons/bs";
import {IoMdInformationCircleOutline} from "react-icons/io";

interface Props {
    msg: IMessage;
    onEdit?: (msg: IMessage) => void;
    onReply?: (msg: IMessage) => void;
    scrollToMessage: (id: string, isReply: boolean) => void;
    registerRef: (el: HTMLDivElement | null) => void;
    openMenuMessageId: string | null;
    setOpenMenuMessageId: (id: string | null) => void;
}

export const Message: React.FC<Props> = ({msg, onEdit, onReply, scrollToMessage, registerRef, openMenuMessageId, setOpenMenuMessageId}) => {
    const {markSeen, deleteMessage} = useSocket();
    const {user} = useAuth();
    const ref = useRef<HTMLDivElement | null>(null);

    const menuVisible = openMenuMessageId === msg._id;
    const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
    const [showInfo, setShowInfo] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || !user) return;

        const alreadyRead = msg.readBy?.some((r) => r.user._id === user._id);
        if (alreadyRead) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        markSeen(msg._id);
                        observer.disconnect();
                    }
                });
            },
            {threshold: 0.6}
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [msg._id, user]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const x = e.clientX;
        const y = e.clientY;
        
        // Получаем размеры окна
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Примерные размеры меню (будут скорректированы после рендера)
        const menuWidth = 200;
        const menuHeight = 250;
        const padding = 10;
        
        // Корректируем позицию если меню выходит за границы
        let adjustedX = x;
        let adjustedY = y;
        
        // Проверка по горизонтали
        if (x + menuWidth + padding > windowWidth) {
            adjustedX = windowWidth - menuWidth - padding;
        }
        if (adjustedX < padding) {
            adjustedX = padding;
        }
        
        // Проверка по вертикали
        if (y + menuHeight + padding > windowHeight) {
            adjustedY = windowHeight - menuHeight - padding;
        }
        if (adjustedY < padding) {
            adjustedY = padding;
        }
        
        setMenuPos({x: adjustedX, y: adjustedY});
        setOpenMenuMessageId(msg._id);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(msg.content || "");
        setOpenMenuMessageId(null);
    };

    const handleEdit = () => {
        onEdit?.(msg);
        setOpenMenuMessageId(null);
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
        setOpenMenuMessageId(null);
    }

    const handleDeleteConfirm = () => {
        deleteMessage?.(msg._id);
        setShowDeleteConfirm(false);
    }

    const handleReply = () => {
        onReply?.(msg);
        setOpenMenuMessageId(null);
    };

    const handleInfo = () => {
        setShowInfo(true);
        setOpenMenuMessageId(null);
    };

    const formatedTime: string = useLocaleTime(msg.createdAt);
    const isOwner: boolean = user!._id === msg.senderId._id;

    const decodeFilename = (filename: string): string => {
        try {
            return decodeURIComponent(filename);
        } catch {
            return filename;
        }
    };

    useEffect(() => {
        if (!menuVisible) return;
        
        const close = (e: MouseEvent) => {
            // Закрываем меню при клике вне его
            const target = e.target as HTMLElement;
            const menuElement = document.querySelector(`.${styles.contextMenu}`);
            if (menuElement && !menuElement.contains(target)) {
                setOpenMenuMessageId(null);
            }
        };
        
        // Небольшая задержка, чтобы не закрыть меню сразу после открытия
        const timeoutId = setTimeout(() => {
            window.addEventListener("click", close);
            window.addEventListener("contextmenu", close);
        }, 100);
        
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("click", close);
            window.removeEventListener("contextmenu", close);
        };
    }, [menuVisible, setOpenMenuMessageId]);


    return (
        <div className={`${styles.messageBlock} ${isOwner ? styles.owner : ""}`}>
            <div ref={registerRef} className={`${styles.message} ${isOwner ? styles.owner : ""}`}
                 onContextMenu={handleContextMenu}>
                <div className={styles.header}>
                    <span className={`${styles.sender} font-roboto`}>{msg.senderId.fullName}</span>
                    <span className={styles.time}>{formatedTime}{msg.edited ? " · изменено" : ""}</span>
                </div>
                {msg.replyTo && (
                    <div
                        className={styles.replyTo}
                        onClick={() => scrollToMessage(msg.replyTo!._id, true)}
                    >
                        <span>
                            <p>{msg.replyTo.senderId.fullName}</p>
                            <p className="font-roboto">{msg.replyTo.content}</p>
                        </span>
                    </div>
                )}

                <div className={`${styles.content} font-roboto`}>{msg.content}</div>

                {msg.attachments && msg.attachments.length > 0 && (
                    <div className={styles.attachments}>
                        {msg.attachments.map((attachment, index) => {
                            const decodedFilename = decodeFilename(attachment.filename || '');
                            return (
                                <div key={index} className={styles.attachment}>
                                    {attachment.type === 'image' ? (
                                        <img
                                            src={attachment.url}
                                            alt={decodedFilename}
                                            className={styles.attachmentImage}
                                            onClick={() => window.open(attachment.url, '_blank')}
                                        />
                                    ) : attachment.type === 'video' ? (
                                        <video
                                            src={attachment.url}
                                            controls
                                            className={styles.attachmentVideo}
                                        />
                                    ) : (
                                        <a
                                            href={attachment.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.attachmentLink}
                                        >
                                            📎 {decodedFilename}
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {msg.readBy && msg.readBy.length > 0 && (
                    <div className={styles.readBy}>
                        ✅ Прочитали: {msg.readBy.map((r) => r.user.fullName).join(", ")}
                    </div>
                )}
            </div>


            {menuVisible && menuPos && (
                <ul
                    className={styles.contextMenu}
                    style={{top: menuPos.y, left: menuPos.x}}
                    onClick={(e) => e.stopPropagation()}
                >
                    <li onClick={handleCopy}><MdContentCopy /> Копировать</li>
                    {user?._id === msg.senderId._id && <>
                        <li onClick={handleEdit}><GoPencil />️ Изменить</li>
                        <li onClick={handleDelete}>
                            <MdOutlineDeleteOutline /> Удалить</li>
                    </>}
                    <li onClick={handleReply}><BsReply /> Ответить</li>
                    <li onClick={handleInfo}><IoMdInformationCircleOutline /> Инфо о прочтении</li>
                </ul>
            )}

            {showInfo && (
                <div className={styles.infoModal}>
                    <div className={styles.infoContent}>
                        <h4>Кто прочитал:</h4>
                        {msg.readBy?.map((r) => (
                            <div key={r.user._id}>
                                {r.user.fullName} — {new Date(r.readAt).toLocaleString()}
                            </div>
                        ))}
                        <button onClick={() => setShowInfo(false)}>Закрыть</button>
                    </div>
                </div>
            )}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteConfirm}
                title="Удаление сообщения"
                message="Вы уверены, что хотите удалить это сообщение?"
                confirmText="Удалить"
                cancelText="Отмена"
                confirmButtonStyle="danger"
            />
        </div>
    );
};