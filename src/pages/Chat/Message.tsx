import React, {useEffect, useRef, useState} from "react";
import {useSocket} from "../../context/SocketContext";
import {IMessage} from "../../store/interfaces/socket.interface";
import {useAuth} from "../../context/AuthContext";
import {useLocaleTime} from "../../hooks/util.hook.ts";
import styles from "./chat.module.sass";

interface Props {
    msg: IMessage;
    onEdit?: (msg: IMessage) => void;
    onReply?: (msg: IMessage) => void;
    scrollToMessage: (id: string, isReply: boolean) => void;
    registerRef: (el: HTMLDivElement | null) => void;
}

export const Message: React.FC<Props> = ({msg, onEdit, onReply, scrollToMessage, registerRef}) => {
    const {markSeen, deleteMessage} = useSocket();
    const {user} = useAuth();
    const ref = useRef<HTMLDivElement | null>(null);

    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
    const [showInfo, setShowInfo] = useState(false);

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
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const menuWidth = 180; // примерная ширина меню
        const menuHeight = 250; // примерная высота меню (с учетом всех пунктов)
        
        let x = e.clientX;
        let y = e.clientY;
        
        // Проверяем, не выходит ли меню за правую границу
        if (x + menuWidth > viewportWidth) {
            x = viewportWidth - menuWidth - 10;
        }
        
        // Проверяем, не выходит ли меню за нижнюю границу
        if (y + menuHeight > viewportHeight) {
            y = viewportHeight - menuHeight - 10;
        }
        
        // Проверяем, не выходит ли меню за левую границу
        if (x < 10) {
            x = 10;
        }
        
        // Проверяем, не выходит ли меню за верхнюю границу
        if (y < 10) {
            y = 10;
        }
        
        setMenuPos({x, y});
        setMenuVisible(true);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(msg.content || "");
        setMenuVisible(false);
    };

    const handleEdit = () => {
        onEdit?.(msg);
        setMenuVisible(false);
    };

    const handleDelete = () => {
        if (!confirm('Удалить сообщение?')) {
            setMenuVisible(false);
            return;
        }
        deleteMessage?.(msg._id);
        setMenuVisible(false);
    }

    const handleReply = () => {
        onReply?.(msg);
        setMenuVisible(false);
    };

    const handleInfo = () => {
        setShowInfo(true);
        setMenuVisible(false);
    };

    const formatedTime: string = useLocaleTime(msg.createdAt);
    const isOwner: boolean = user!._id === msg.senderId._id;

    useEffect(() => {
        const close = () => setMenuVisible(false);
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, []);

    useEffect(() => {
        console.log(msg)
    }, []);

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
                >
                    <li onClick={handleCopy}>📋 Копировать</li>
                    {user?._id === msg.senderId._id && <>
                        <li onClick={handleEdit}>✏️ Изменить</li>
                        <li onClick={handleDelete}>Удалить</li>
                    </>}
                    <li onClick={handleReply}>↩️ Ответить</li>
                    <li onClick={handleInfo}>👀 Инфо о прочтении</li>
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
        </div>
    );
};