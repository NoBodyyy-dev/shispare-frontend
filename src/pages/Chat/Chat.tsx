import React, {useRef, useState, useEffect} from "react";
import {FaPaperclip} from "react-icons/fa6";
import {IoSend} from "react-icons/io5";
import {useSocket} from "../../context/SocketContext";
import {IMessage, Attachments} from "../../store/interfaces/socket.interface";
import {Message} from "./Message";
import styles from "./chat.module.sass";
import {Button} from "../../lib/buttons/Button.tsx";
import {MainTextarea} from "../../lib/input/MainTextarea.tsx";
import api from "../../store/api";

export const Chat: React.FC = () => {
    const {chatMessages, sendMessage, onlineAdmins, editMessage, emitTyping, typingUsers} = useSocket();
    const [text, setText] = useState("");
    const [replyTo, setReplyTo] = useState<IMessage | null>(null);
    const [editingMessage, setEditingMessage] = useState<IMessage | null>(null);
    const [showOnlineModal, setShowOnlineModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [attachments, setAttachments] = useState<Attachments[]>([]);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [openMenuMessageId, setOpenMenuMessageId] = useState<string | null>(null);

    const messageRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const handleSend = async () => {
        if (!text.trim() && attachments.length === 0) return;

        if (editingMessage) {
            setIsSending(true);
            try {
                // При редактировании отправляем новые вложения, если они есть, иначе оставляем старые
                const attachmentsToSend = attachments.length > 0 ? attachments : (editingMessage.attachments || []);
                editMessage(editingMessage._id, text || "", attachmentsToSend.length > 0 ? attachmentsToSend : undefined);
                setEditingMessage(null);
                setText("");
                setAttachments([]);
            } catch (error) {
                console.error("Ошибка при редактировании сообщения:", error);
            } finally {
                setIsSending(false);
            }
        } else {
            setIsSending(true);
            try {
                sendMessage(text || "", attachments.length > 0 ? attachments : undefined, replyTo?._id);
                setText("");
                setReplyTo(null);
                setAttachments([]);
            } catch (error) {
                console.error("Ошибка при отправке сообщения:", error);
            } finally {
                setIsSending(false);
            }
        }

        inputRef.current?.focus();

        setTimeout(() => {
            const lastMessageId = chatMessages[chatMessages.length - 1]?._id;
            if (lastMessageId) scrollToMessage(lastMessageId, false);
        }, 100);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingFiles(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);

                const response = await api.post("/user/chat/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                return response.data.attachment as Attachments;
            });

            const uploadedAttachments = await Promise.all(uploadPromises);
            setAttachments(prev => [...prev, ...uploadedAttachments]);
        } catch (error) {
            console.error("Ошибка при загрузке файлов:", error);
            // Ошибка будет обработана через push messages, если нужно
        } finally {
            setUploadingFiles(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const decodeFilename = (filename: string): string => {
        if (/[^\x00-\x7F]/.test(filename)) {
            return filename;
        }
        const decoded = decodeURIComponent(escape(filename));
        if (decoded !== filename && /[\u0400-\u04FF]/.test(decoded)) {
            return decoded;
        }
        return filename;
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
        if (editingMessage) {
            const currentMessage = chatMessages.find(msg => msg._id === editingMessage._id);
            if (!currentMessage) {
                setEditingMessage(null);
                setText("");
                setAttachments([]);
            } else if (currentMessage.content !== editingMessage.content || 
                      JSON.stringify(currentMessage.attachments) !== JSON.stringify(editingMessage.attachments)) {
                setEditingMessage(currentMessage);
                setText(currentMessage.content || "");
                setAttachments(currentMessage.attachments || []);
            }
        }
    }, [chatMessages, editingMessage]);

    useEffect(() => {
        if (!messagesContainerRef.current) return;
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }, [chatMessages]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);

        if (!editingMessage) {
            emitTyping(true);
            if (typingTimeoutRef.current) {
                window.clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = window.setTimeout(() => emitTyping(false), 1500);
        }
    };

    const cancelEdit = () => {
        setEditingMessage(null);
        setText("");
        setReplyTo(null);
        setAttachments([]);
        inputRef.current?.focus();
    };

    const cancelReply = () => {
        setReplyTo(null);
        inputRef.current?.focus();
    };

    return (
        <div className={`${styles.chatPage}`} tabIndex={-1}>
            <div className={styles.chatHeader}>
                <div className={styles.onlineInfo}>
                        <span
                            className={styles.onlineLink}
                            onClick={() => setShowOnlineModal(true)}
                        >
                            В сети: {onlineAdmins.length}
                        </span>
                </div>
                {typingUsers && typingUsers.length > 0 && (
                    <div className={styles.typingIndicator}>
                        {typingUsers.join(', ')} {typingUsers.length > 1 ? 'печатают...' : 'печатает...'}
                    </div>
                )}
            </div>
            <div
                className={`${styles.messagesContainer} ${replyTo || editingMessage ? styles.replyPadding : ""}`}
                ref={messagesContainerRef}
                tabIndex={-1}
            >
                {chatMessages.map((msg) => (
                    <Message
                        key={msg._id}
                        msg={msg}
                        onReply={(m) => {
                            setReplyTo(m);
                            setEditingMessage(null); // Сбрасываем редактирование при ответе
                            inputRef.current?.focus();
                        }}
                        onEdit={(m) => {
                            setEditingMessage(m);
                            setText(m.content || "");
                            setAttachments(m.attachments || []);
                            setReplyTo(null); // Сбрасываем ответ при редактировании
                            inputRef.current?.focus();
                        }}
                        scrollToMessage={scrollToMessage}
                        registerRef={(el) => messageRefs.current.set(msg._id, el)}
                        openMenuMessageId={openMenuMessageId}
                        setOpenMenuMessageId={setOpenMenuMessageId}
                    />
                ))}
                <div ref={scrollRef}/>
            </div>


            <div className={styles.fixedInputBox}>
                {editingMessage && (
                    <div className={styles.replyPreview}>
                        <span className={styles.replyLabel}>Редактирование сообщения:</span>
                        <span className={styles.replyText}>{editingMessage.content}</span>
                        <button
                            className={styles.cancelReply}
                            onClick={cancelEdit}
                            title="Отменить редактирование"
                        >
                            ✖
                        </button>
                    </div>
                )}
                {replyTo && (
                    <div className={styles.replyPreview}>
                        <span className={styles.replyLabel}>Ответ на:</span>
                        <span className={styles.replyText}>{replyTo.content}</span>
                        <button
                            className={styles.cancelReply}
                            onClick={cancelReply}
                            title="Отменить ответ"
                        >
                            ✖
                        </button>
                    </div>
                )}
                {attachments.length > 0 && (
                    <div className={styles.attachmentsPreview}>
                        {attachments.map((attachment, index) => {
                            const decodedFilename = decodeFilename(attachment.filename);
                            return (
                                <div key={index} className={styles.attachmentItem}>
                                    {attachment.type === 'image' ? (
                                        <img src={attachment.url} alt={decodedFilename}
                                             className={styles.attachmentImage}/>
                                    ) : (
                                        <div className={styles.attachmentFile}>
                                            <span>📎 {decodedFilename}</span>
                                        </div>
                                    )}
                                    <button
                                        className={styles.removeAttachment}
                                        onClick={() => removeAttachment(index)}
                                        title="Удалить"
                                    >
                                        ✖
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className={styles.inputBox}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        style={{display: 'none'}}
                        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                    />
                    <Button
                        className="fz-16 w-40"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFiles}
                        loading={uploadingFiles}
                        title="Прикрепить файл"
                    >
                        <FaPaperclip/>
                    </Button>

                    <MainTextarea
                        tabIndex={1}
                        ref={inputRef}
                        value={text}
                        placeholder={editingMessage ? "Редактирование сообщения..." : "Напишите сообщение..."}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        disabled={isSending}
                    />

                    <Button
                        onClick={handleSend}
                        className=""
                        disabled={isSending || (!text.trim() && attachments.length === 0)}
                        loading={isSending}
                    >
                        <IoSend/>
                    </Button>
                </div>
            </div>

            {showOnlineModal && (
                <div className={styles.onlineModal} onClick={() => setShowOnlineModal(false)}>
                    <div className={styles.onlineModalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.onlineModalHeader}>
                            <h3>Онлайн администраторы</h3>
                            <Button
                                className={styles.closeButton}
                                onClick={() => setShowOnlineModal(false)}
                            >
                                ✖
                            </Button>
                        </div>
                        <div className={styles.onlineModalList}>
                            {onlineAdmins.length > 0 ? (
                                onlineAdmins.map((admin) => (
                                    <div key={admin._id} className={styles.onlineAdminItem}>
                                        <span className={styles.onlineIndicator}>🟢</span>
                                        <span>{admin.fullName}</span>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noAdmins}>Нет администраторов онлайн</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};