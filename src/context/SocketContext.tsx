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

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({children}: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const {isAuthenticated, token, user} = useAuth();
    const {socket} = useAppSelector(state => state.socket);
    const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [onlineAdmins, setOnlineAdmins] = useState<string[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const emitTyping = (isTyping: boolean) => {
        socket?.emit('chat:typing', {isTyping});
    };

    useEffect(() => {
        if (!isAuthenticated || !token) {
            if (socket) socket.disconnect();
            return;
        }

        const newSocket: Socket = io(API_URL, {
            auth: {token},
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: Infinity,
        });

        newSocket.on("connect", () => {
            console.log("Socket connected");

            newSocket.emit('join:user', (res: { success: boolean; error?: string }) => {
                if (!res.success) console.error(res.error);
            });

            if (user?.role === 'Admin') {
                newSocket.emit('admin:reconnect');

                newSocket.on('admin:online', (data: { onlineAdmins: string[], yourId: string }) => {
                    setOnlineAdmins(data.onlineAdmins);
                });
            }
        });

        newSocket.on("reconnect", (attempt) => {
            console.log(`Reconnected (attempt ${attempt})`);
            if (user?.role === 'Admin') newSocket.emit('admin:reconnect');
        });

        newSocket.on("admin:getOrders", (res: { orders: IOrder[], success: boolean }) => {
            console.log(res);
            if (res.success) {
                setOrders(res.orders);
            }
        })
        newSocket.on("admin:newOrder", (res: { order: IOrder, success: boolean }) => {
            console.log(res);
            if (res.success) {
                setOrders([...orders, res.order]);
            }
        })
        newSocket.on('admin:orderUpdated', (order: IOrder) => {
            setOrders(prev => prev.map(o => o._id === order._id ? order : o));
        });

        newSocket.emit("chat:get", (res: { success: boolean; messages?: IMessage[]; message?: string }) => {
            if (res.success && res.messages) {
                setChatMessages(res.messages);
            } else {
                console.error(res.message);
            }
        });

        newSocket.on("chat:newMessage", (msg: IMessage) => {
            setChatMessages(prev => [...prev, msg]);
            if (msg.senderId._id !== user?._id)
                dispatch(addMessage(msg.content!));
        });

        newSocket.on('chat:typing', (data: { userId: string; fullName?: string; isTyping: boolean }) => {
            const name = data.fullName || data.userId;
            setTypingUsers(prev => {
                if (data.isTyping) {
                    if (prev.includes(name)) return prev;
                    return [...prev, name];
                } else {
                    return prev.filter(id => id !== name);
                }
            });
        });

        newSocket.on('chat:editMessage', (msg: IMessage) => {
            setChatMessages(prev => prev.map(m => m._id === msg._id ? msg : m));
        });
        newSocket.on('chat:deleteMessage', ({messageId}: { messageId: string }) => {
            setChatMessages(prev => prev.filter(m => m._id !== messageId));
        });
        newSocket.on("chat:markSeen", ({messageId, user}: { messageId: string; user: UserInterface }) => {
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
        });


        dispatch(setSocket(newSocket));


        return () => {
            newSocket.off('admin:online');
            newSocket.off('chat:newMessage');
            newSocket.off('chat:editMessage');
            newSocket.off('chat:deleteMessage');
            newSocket.disconnect();
        };
    }, [isAuthenticated]);

    const getOrders = () => {
        socket?.emit('admin:getOrders', (res: { success: boolean; orders?: IOrder[]; message?: string }) => {
            console.log(res)
            if (res.success && res.orders) setOrders(res.orders);
            else console.error(res.message);
        });
    };

    const updateOrderStatus = (orderId: string, status: string) => {
        socket?.emit('admin:updateOrderStatus', {orderId, status}, (res: {
            success: boolean;
            order?: IOrder;
            message?: string
        }) => {
            if (!res.success) console.error(res.message);
            setOrders(prev => prev.map(o => o._id === orderId ? res.order! : o));
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

    const sendMessage = (content: string, attachments?: Attachments, replyTo?: string) => {
        console.log(">>>", socket);
        socket?.emit('chat:sendMessage', {content, attachments, replyTo}, (res: any) => {
            console.log("Test")
            if (!res.success) console.error(res.message);
        });
    };

    const editMessage = (messageId: string, content?: string, attachments?: Attachments) => {
        socket?.emit('chat:editMessage', {messageId, content, attachments}, (res: any) => {
            if (!res.success) console.error(res.message);
        });
    };

    const deleteMessage = (messageId: string) => {
        socket?.emit('chat:deleteMessage', {messageId}, (res: any) => {
            if (!res.success) console.error(res.message);
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