import React, {useRef, useState, useEffect} from "react";
import {useSocket} from "../../context/SocketContext";
import {IMessage} from "../../store/interfaces/socket.interface";
import {Message} from "./Message";
import styles from "./chat.module.sass";
import {MainInput} from "../../lib/input/MainInput.tsx";
import {Button} from "../../lib/buttons/Button.tsx";

export const Chat: React.FC = () => {
    const {chatMessages, sendMessage} = useSocket();
    const [text, setText] = useState("");
    const [replyTo, setReplyTo] = useState<IMessage | null>(null);

    const messageRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null); // 👈 ref для инпута


    const handleSend = () => {
        if (!text.trim()) return;

        sendMessage(text, undefined, replyTo?._id);
        setText("");
        setReplyTo(null);

        inputRef.current?.focus();

        const lastMessageId = chatMessages[chatMessages.length - 1]?._id;
        if (lastMessageId) scrollToMessage(lastMessageId, false);
    };

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
            <div className="flex-align-center mb-20 gap-40">
                <h1 className="title">Чат</h1>
                <p className="font-roboto">В сети: {0}</p>
            </div>
            <div className={`${styles.chatPage}`}>

                <div className={styles.messagesContainer} ref={messagesContainerRef}>
                    {chatMessages.map((msg) => (
                        <Message
                            key={msg._id}
                            msg={msg}
                            onReply={(m) => setReplyTo(m)}
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
                    <MainInput
                        ref={inputRef}
                        type="text"
                        value={text}
                        placeholder="Напишите сообщение..."
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <Button onClick={handleSend}>Отправить</Button>
                </div>
            </div>
        </div>
    );
};
