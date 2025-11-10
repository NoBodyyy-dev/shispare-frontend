import {Socket} from "socket.io-client";
import {UserInterface} from "./user.interface.ts";
import {IOrder} from "./order.interface.ts";

export type OrderStatus =
    | 'pending'     // Ожидает подтверждения
    | 'processing'  // В обработке
    | 'confirmed'   // Подтвержден
    | 'shipped'     // Отправлен
    | 'delivered'   // Доставлен
    | 'cancelled'   // Отменен
    | 'refunded';   // Возвращен

// Типы способов доставки
export type DeliveryType =
    | 'pickup'      // Самовывоз
    | 'courier'     // Курьерская доставка
    | 'post'        // Почта России
    | 'express';    // Экспресс-доставка

// Типы способов оплаты
export type PaymentMethod =
    | 'card'        // Оплата картой
    | 'cash'        // Наличные при получении
    | 'sbp'         // Система быстрых платежей
    | 'invoice';    // По счету для юр. лиц

// Интерфейсы для данных заказа
export interface IOrderItem {
    product: string;
    optionIndex: number;
    quantity: number;
    price: number;
    discount?: number;
}

export interface IDeliveryInfo {
    city: string;
    address: string;
    postalCode?: string;
    recipientName: string;
    phone: string;
    comment?: string;
}

export interface UpdateStatusData {
    orderId: string;
    newStatus: OrderStatus;
    trackingNumber?: string;
    deliveryDate?: Date;
}

export interface IMessage {
    _id: string;
    senderId: UserInterface;
    content?: string;
    attachments?: Attachments[];
    replyTo?: IMessage;
    edited?: boolean;
    createdAt: Date;
    updatedAt?: Date;
    readBy: {
        user: UserInterface;
        readAt: Date;
    }[];
}

export interface Attachments {
    type: 'image' | 'video' | 'file';
    url: string;
    filename: string;
}

export interface SocketContextType {
    socket: Socket | null;

    // ==== чат ===
    onlineAdmins: string[];
    chatMessages: IMessage[];
    typingUsers: string[];
    sendMessage: (content: string, attachments?: Attachments, replyTo?: string) => void;
    editMessage: (messageId: string, content?: string, attachments?: Attachments) => void;
    deleteMessage: (messageId: string) => void;
    emitTyping: (isTyping: boolean) => void;

    // ==== заказы ====
    orders: IOrder[];
    getOrders: () => void;
    updateOrderStatus: (orderId: string, status: string) => void;

    // ==== комнаты ====
    joinRoom: (room: string, callback?: (res: any) => void) => void;
    leaveRoom: (room: string) => void;
    refreshRooms: () => void;

    // ==== утилиты ====
    ping: (callback?: (res: string) => void) => void;
    markSeen: (messageId: string) => void;
}