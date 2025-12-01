import {createContext, useContext, useEffect, ReactNode, useState} from 'react';
import {io, Socket} from 'socket.io-client';
import {useAppDispatch, useAppSelector} from '../hooks/state.hook';
import {useAuth} from './AuthContext';
import {
    setSocket,
} from '../store/slices/socket.slice';
import {
    Attachments,
    IMessage,
    SocketContextType,
} from "../store/interfaces/socket.interface"
import {addMessage} from "../store/slices/push.slice.ts";
import {UserInterface} from "../store/interfaces/user.interface.ts";
import {IOrder} from "../store/interfaces/order.interface.ts";

// Функция для получения текста статуса заказа на русском
const getOrderStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
        'waiting_for_payment': 'Ожидание оплаты',
        'pending': 'В обработке',
        'processing': 'Обрабатывается',
        'confirmed': 'Подтвержден',
        'shipped': 'Отправлен',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен',
        'refunded': 'Возвращен'
    };
    return statusMap[status] || status;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({children}: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const {isAuthenticated, token, user} = useAuth();
    const {socket} = useAppSelector(state => state.socket);
    const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [onlineAdmins, setOnlineAdmins] = useState<{ _id: string; fullName: string }[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const emitTyping = (isTyping: boolean) => {
        socket?.emit('chat:typing', {isTyping});
    };

    useEffect(() => {
        if (!isAuthenticated || !token) {
            if (socket) {
                socket.off();
                socket.disconnect();
            }
            return;
        }

        // Отключаем старый socket перед созданием нового
        if (socket) {
            socket.off();
            socket.disconnect();
        }

        const newSocket: Socket = io(API_URL, {
            auth: {token},
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: Infinity,
        });

        const handleConnect = () => {
            console.log("Socket connected");

            newSocket.emit('join:user', (res: { success: boolean; error?: string }) => {
                if (!res.success) console.error(res.error);
            });

            if (user?.role === 'Admin') {
                newSocket.emit('admin:reconnect');
            }
        };

        const handleReconnect = (attempt: number) => {
            console.log(`Reconnected (attempt ${attempt})`);
            if (user?.role === 'Admin') newSocket.emit('admin:reconnect');
        };

        const handleAdminOnline = (data: { onlineAdmins: { _id: string; fullName: string }[], yourId: string }) => {
            setOnlineAdmins(data.onlineAdmins);
        };

        const handleAdminGetOrders = (res: { orders: IOrder[], success: boolean }) => {
            console.log(res);
            if (res.success) {
                setOrders(res.orders);
            }
        };

        const handleAdminNewOrder = (res: { order: IOrder, success: boolean }) => {
            console.log(res);
            if (res.success) {
                setOrders(prev => [...prev, res.order]);
                // Уведомление для администратора при новом заказе
                dispatch(addMessage({
                    text: `Новый заказ #${res.order.orderNumber}`,
                    type: 'info'
                }));
            }
        };

        const handleAdminOrderUpdated = (order: IOrder) => {
            setOrders(prev => prev.map(o => o._id === order._id ? order : o));
            // Уведомление для администратора при изменении статуса заказа
            dispatch(addMessage({
                text: `Статус заказа #${order.orderNumber} изменен на: ${getOrderStatusText(order.status)}`,
                type: 'info'
            }));
        };

        const handleOrderUpdated = (data: { orderId: string; status: string }) => {
            // Уведомление для пользователя при изменении статуса его заказа
            const statusText = getOrderStatusText(data.status);
            dispatch(addMessage({
                text: `Статус вашего заказа изменен на: ${statusText}`,
                type: 'info'
            }));
        };

        const handleChatNewMessage = (msg: IMessage) => {
            setChatMessages(prev => {
                // Проверяем, нет ли уже такого сообщения (защита от дубликатов)
                if (prev.some(m => m._id === msg._id)) {
                    return prev;
                }
                return [...prev, msg];
            });
            // Уведомление только если это не наше сообщение
            if (msg.senderId._id !== user?._id) {
                // Для администраторов показываем уведомление о новом сообщении в чате
                if (user?.role === 'Admin') {
                    const senderName = typeof msg.senderId === 'object' && msg.senderId?.fullName 
                        ? msg.senderId.fullName 
                        : 'Пользователь';
                    dispatch(addMessage({
                        text: `Новое сообщение от ${senderName}: ${msg.content || 'файл'}`,
                        type: 'info'
                    }));
                } else {
                    // Для обычных пользователей просто показываем сообщение
                    dispatch(addMessage(msg.content!));
                }
            }
        };

        const handleChatTyping = (data: { userId: string; fullName?: string; isTyping: boolean }) => {
            const name = data.fullName || data.userId;
            setTypingUsers(prev => {
                if (data.isTyping) {
                    if (prev.includes(name)) return prev;
                    return [...prev, name];
                } else {
                    return prev.filter(id => id !== name);
                }
            });
        };

        const handleChatEditMessage = (msg: IMessage) => {
            setChatMessages(prev => prev.map(m => {
                if (m._id === msg._id) {
                    return {
                        ...msg,
                        edited: true,
                        updatedAt: msg.updatedAt || new Date()
                    };
                }
                return m;
            }));
        };

        const handleChatDeleteMessage = ({messageId}: { messageId: string }) => {
            setChatMessages(prev => prev.filter(m => m._id !== messageId));
        };

        const handleChatMarkSeen = ({messageId, user}: { messageId: string; user: UserInterface }) => {
            setChatMessages(prev =>
                prev.map(m =>
                    m._id === messageId
                        ? {
                            ...m,
                            readBy: m.readBy
                                ? [
                                    ...m.readBy.filter(u => u.user._id !== user._id),
                                    {user, readAt: new Date()}
                                ]
                                : [{user, readAt: new Date()}],
                        }
                        : m
                )
            );
        };

        // Подписываемся на события
        newSocket.on("connect", handleConnect);
        newSocket.on("reconnect", handleReconnect);
        
        if (user?.role === 'Admin') {
            newSocket.on('admin:online', handleAdminOnline);
        }
        
        newSocket.on("admin:getOrders", handleAdminGetOrders);
        newSocket.on("admin:newOrder", handleAdminNewOrder);
        newSocket.on('admin:orderUpdated', handleAdminOrderUpdated);
        
        // Обработчик изменения статуса заказа для пользователей
        newSocket.on('order-updated', handleOrderUpdated);

        newSocket.emit("chat:get", (res: { success: boolean; messages?: IMessage[]; message?: string }) => {
            if (res.success && res.messages) {
                setChatMessages(res.messages);
            } else {
                console.error(res.message);
            }
        });

        newSocket.on("chat:newMessage", handleChatNewMessage);
        newSocket.on('chat:typing', handleChatTyping);
        newSocket.on('chat:editMessage', handleChatEditMessage);
        newSocket.on('chat:deleteMessage', handleChatDeleteMessage);
        newSocket.on("chat:markSeen", handleChatMarkSeen);

        dispatch(setSocket(newSocket));

        // Cleanup функция - отписываемся от всех событий
        return () => {
            newSocket.off("connect", handleConnect);
            newSocket.off("reconnect", handleReconnect);
            newSocket.off('admin:online', handleAdminOnline);
            newSocket.off("admin:getOrders", handleAdminGetOrders);
            newSocket.off("admin:newOrder", handleAdminNewOrder);
            newSocket.off('admin:orderUpdated', handleAdminOrderUpdated);
            newSocket.off('order-updated', handleOrderUpdated);
            newSocket.off("chat:newMessage", handleChatNewMessage);
            newSocket.off('chat:typing', handleChatTyping);
            newSocket.off('chat:editMessage', handleChatEditMessage);
            newSocket.off('chat:deleteMessage', handleChatDeleteMessage);
            newSocket.off("chat:markSeen", handleChatMarkSeen);
            newSocket.disconnect();
        };
    }, [isAuthenticated, token, user?._id]);

    const getOrders = () => {
        socket?.emit('admin:getOrders', (res: { success: boolean; orders?: IOrder[]; message?: string }) => {
            console.log(res)
            if (res.success && res.orders) setOrders(res.orders);
            else console.error(res.message);
        });
    };

    const updateOrderStatus = (orderId: string, status: string, cancellationReason?: string, deliveryDate?: string) => {
        socket?.emit('admin:updateOrderStatus', {orderId, status, cancellationReason, deliveryDate}, (res: {
            success: boolean;
            order?: IOrder;
            message?: string
        }) => {
            if (!res.success) console.error(res.message);
            if (res.order) {
                setOrders(prev => prev.map(o => o._id === orderId ? res.order! : o));
            }
        });
    };

    const joinRoom = (room: string, callback?: (res: any) => void) => {
        socket?.emit('subscribe', room, callback);
    };

    const leaveRoom = (room: string) => {
        socket?.emit('unsubscribe', room);
    };

    const refreshRooms = () => {
        socket?.emit('refresh-rooms');
    };

    const ping = (callback?: (res: string) => void) => {
        socket?.emit('ping', callback);
    };

    const sendMessage = (content: string, attachments?: Attachments[], replyTo?: string) => {
        if (!socket) {
            dispatch(addMessage({
                text: "Соединение с сервером потеряно. Переподключение...",
                type: "error"
            }));
            return;
        }
        
        socket.emit('chat:sendMessage', {content, attachments, replyTo}, (res: any) => {
            if (!res.success) {
                console.error(res.message);
                dispatch(addMessage({
                    text: res.message || "Ошибка при отправке сообщения",
                    type: "error"
                }));
            }
        });
    };

    const editMessage = (messageId: string, content?: string, attachments?: Attachments[]) => {
        if (!user?._id) return;
        socket?.emit('chat:editMessage', {
            messageId,
            editorId: user._id,
            newContent: content,
            newAttachments: attachments
        }, (res: any) => {
            if (!res.success) {
                console.error(res.message);
                dispatch(addMessage({
                    text: res.message || "Ошибка при редактировании сообщения",
                    type: "error"
                }));
            }
        });
    };

    const deleteMessage = (messageId: string) => {
        if (!user?._id) return;
        socket?.emit('chat:deleteMessage', {
            messageId,
            deleterId: user._id
        }, (res: any) => {
            if (!res.success) {
                console.error(res.message);
                dispatch(addMessage({
                    text: res.message || "Ошибка при удалении сообщения",
                    type: "error"
                }));
            }
        });
    };

    const markSeen = (messageId: string) => {
        socket?.emit("chat:markSeen", {messageId});
    };

    const value: SocketContextType = {
        onlineAdmins,
        socket,
        chatMessages,
        typingUsers,
        orders,
        getOrders,
        updateOrderStatus,
        joinRoom,
        leaveRoom,
        refreshRooms,
        ping,
        sendMessage,
        editMessage,
        deleteMessage,
        emitTyping,
        markSeen
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error('useSocket must be used within SocketProvider');
    return context;
};