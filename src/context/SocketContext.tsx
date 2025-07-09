import {createContext, useContext, useEffect, useRef, ReactNode} from 'react';
import {io, Socket} from 'socket.io-client';
import {useAppDispatch, useAppSelector} from '../hooks/state.hook';
import {useAuth} from './AuthContext';
import {
    setSocket,
    setConnectionStatus,
    incrementReconnectAttempts,
    resetConnectionState,
    setConnectionError,
    setOnlineAdmins,
    clearSocket
} from '../store/slices/socket.slice';
import {
    IOrder,
    CreateOrderData,
    UpdateStatusData,
    SocketContextType,
} from "../store/interfaces/socket.interface"

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({children}: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const {isAuthenticated, token, user} = useAuth();
    const {socket, isConnected} = useAppSelector(state => state.socket);
    const prevRoleRef = useRef(user?.role);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    useEffect(() => {
        if (!isAuthenticated || !token) {
            if (socket) {
                socket.disconnect();
                dispatch(clearSocket());
            }
            return;
        }

        if (socket?.connected) return;
        console.log(">>>", token)
        const newSocket = io(API_URL, {
            auth: {token},
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
        });

        newSocket.emit('join:user', (response: { success: boolean; error?: string }) => {
            if (!response?.success) console.error('Failed to join user room:', response?.error);
        });

        if (user?.role === 'Admin') {
            newSocket.emit('join:admin', (response: { success: boolean; error?: string }) => {
                if (!response?.success) console.error('Failed to join admin room:', response?.error);
            });
        }

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        newSocket.on("connect_error", (err) => {
            console.error("Socket error:", err.message);
        });

        dispatch(setSocket(newSocket));

        return () => {
            if (!isAuthenticated) {
                newSocket.disconnect();
            }
        };
    }, [isAuthenticated, token, dispatch]);

    // autoConnect: true,
    // reconnection: true,
    // reconnectionAttempts: 5,
    // reconnectionDelay: 1000,
    // dispatch(setSocket({socket: newSocket}));
    // console.log(newSocket)
    //
    // newSocket.on('connect', () => {
    //     dispatch(setConnectionStatus({isConnected: true}));
    //     dispatch(resetConnectionState());
    //     console.log("connect")
    //
    //     newSocket.emit('join:user', (response: { success: boolean; error?: string }) => {
    //         if (!response?.success) console.error('Failed to join user room:', response?.error);
    //     });
    //
    //     if (user?.role === 'Admin') {
    //         newSocket.emit('join:admin', (response: { success: boolean; error?: string }) => {
    //             if (!response?.success) console.error('Failed to join admin room:', response?.error);
    //         });
    //     }
    // });
    //
    // newSocket.on('disconnect', () => dispatch(setConnectionStatus({isConnected: false})));
    // newSocket.on('connect_error', (err) => {
    //     dispatch(setConnectionError({error: err.message}));
    //     dispatch(incrementReconnectAttempts());
    // });
    // newSocket.on('admin:online', (admins: string[]) => dispatch(setOnlineAdmins({onlineAdmins: admins})));
    //
    // console.log(">>>", isAuthenticated)
    // return () => {
    //     newSocket.off('connect');
    //     newSocket.off('disconnect');
    //     newSocket.off('connect_error');
    //     newSocket.off('admin:online');
    // };

    // useEffect(() => {
    //     if (!socket || !user || prevRoleRef.current === user.role) return;
    //
    //     if (user.role === 'Admin') {
    //         socket.emit('join:admin', (response: { success: boolean; error?: string }) => {
    //             if (!response?.success) console.error('Admin join failed:', response?.error);
    //         });
    //     }
    //
    //     prevRoleRef.current = user.role;
    // }, [user?.role, socket]);
    //
    // const createOrder = (data: CreateOrderData): Promise<IOrder> => {
    //     return new Promise((resolve, reject) => {
    //         if (!socket || !isConnected) return reject('Socket not connected');
    //
    //         socket.emit('order:create', data, (res: { success: boolean; order?: IOrder; error?: string }) => {
    //             if (res.success && res.order) {
    //                 resolve(res.order);
    //             } else {
    //                 reject(res.error || 'Failed to create order');
    //             }
    //         });
    //     });
    // };
    //
    // const updateOrderStatus = (data: UpdateStatusData): Promise<IOrder> => {
    //     return new Promise((resolve, reject) => {
    //         if (!socket || !isConnected) return reject('Socket not connected');
    //         if (user?.role !== 'Admin') return reject('Forbidden');
    //
    //         socket.emit('order:update-status', data, (res: { success: boolean; order?: IOrder; error?: string }) => {
    //             if (res.success && res.order) {
    //                 resolve(res.order)
    //             } else {
    //                 reject(res.error || 'Failed to update order status');
    //             }
    //         });
    //     });
    // };
    //
    // const trackOrder = (orderId: string) => {
    //     if (!socket || !isConnected) return;
    //     socket.emit('order:track-progress', orderId.toString());
    // };

    const value = {
        // createOrder,
        // updateOrderStatus,
        // trackOrder,
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

// Вспомогательные типы для Redux (если нужно)
export type OrderSocketState = {
    socket: Socket | null;
    isConnected: boolean;
    reconnectAttempts: number;
    connectionError: string | null;
    onlineAdmins: string[];
};