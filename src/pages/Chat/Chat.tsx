import React, {useRef, useState, useEffect} from "react";
import {FaPaperclip} from "react-icons/fa6";
import {IoSend} from "react-icons/io5";
import {useSocket} from "../../context/SocketContext";
import {IMessage} from "../../store/interfaces/socket.interface";
import {Message} from "./Message";
import styles from "./chat.module.sass";
import {Button} from "../../lib/buttons/Button.tsx";
import {MainTextarea} from "../../lib/input/MainTextarea.tsx";

export const Chat: React.FC = () => {
    const {chatMessages, sendMessage, onlineAdmins, editMessage, emitTyping, typingUsers} = useSocket();
    const [text, setText] = useState("");
    const [replyTo, setReplyTo] = useState<IMessage | null>(null);
    const [editingMessage, setEditingMessage] = useState<IMessage | null>(null);

    const messageRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    const handleSend = () => {
        if (!text.trim()) return;
        if (editingMessage) {
            editMessage(editingMessage._id, text);
        } else {
            sendMessage(text, undefined, replyTo?._id);
        }
        setText("");
        setReplyTo(null);
        setEditingMessage(null);

        inputRef.current?.focus();

        const lastMessageId = chatMessages[chatMessages.length - 1]?._id;
        if (lastMessageId) scrollToMessage(lastMessageId, false);
    };

    const typingTimeoutRef = useRef<number | null>(null);

    const scrollToMessage = (id: string, isReply: boolean) => {
        const el = messageRefs.current.get(id);
        if (el) {
            el.scrollIntoView({behavior: "smooth", block: "center"});
            if (isReply) {
                el.classList.add(styles.highlight);
                setTimeout(() => el.classList.remove(styles.highlight), 1500);
            }
        }
    };

    useEffect(() => {
        if (!messagesContainerRef.current) return;
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }, [chatMessages]);

    return (

        <div className="main__container">
            <div className={`${styles.chatPage}`} tabIndex={-1}>
                <div className={styles.chatHeader}>
                    В сети: {onlineAdmins}
                    {typingUsers && typingUsers.length > 0 && (
                        <div className={styles.typingIndicator}>
                            {typingUsers.join(', ')} {typingUsers.length > 1 ? 'печатают...' : 'печатает...'}
                        </div>
                    )}
                </div>
                <div className={styles.messagesContainer} ref={messagesContainerRef} tabIndex={-1}>
                    {chatMessages.map((msg) => (
                        <Message
                            key={msg._id}
                            msg={msg}
                            onReply={(m) => setReplyTo(m)}
                            onEdit={(m) => {
                                setEditingMessage(m);
                                setText(m.content || "");
                                inputRef.current?.focus();
                            }}
                            scrollToMessage={scrollToMessage}
                            registerRef={(el) => messageRefs.current.set(msg._id, el)}
                        />
                    ))}
                </div>

                {replyTo && (
                    <div className={styles.replyPreview}>
                        <span className={styles.replyLabel}>Ответ на:</span>
                        <span className={styles.replyText}>{replyTo.content}</span>
                        <button
                            className={styles.cancelReply}
                            onClick={() => setReplyTo(null)}
                        >
                            ✖
                        </button>
                    </div>
                )}

                <div className={styles.inputBox}>
                    <Button className="fz-16 w-40"><FaPaperclip/></Button>

                    <MainTextarea
                        className="main-textarea"
                        tabIndex={1}
                        ref={inputRef}
                        value={text}
                        placeholder="Напишите сообщение..."
                        onChange={(e) => {
                            setText(e.target.value);
                            emitTyping(true);
                            if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
                            typingTimeoutRef.current = window.setTimeout(() => emitTyping(false), 1500);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />

                    <Button onClick={handleSend} className=""><IoSend/></Button>
                </div>
            </div>
        </div>
    );
};

