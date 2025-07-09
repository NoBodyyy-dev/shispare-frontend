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

export interface IOrder {
    _id: string;
    orderNumber: string;
    owner: string;
    items: IOrderItem[];
    totalAmount: number;
    discountAmount: number;
    deliveryCost: number;
    finalAmount: number;
    status: OrderStatus;
    deliveryType: DeliveryType;
    deliveryInfo: IDeliveryInfo;
    paymentMethod: PaymentMethod;
    paymentStatus: boolean;
    invoiceUrl?: string;
    trackingNumber?: string;
    createdAt: Date;
    updatedAt: Date;
    cancelledAt?: Date;
    deliveredAt?: Date;
    documentUrl: string;
}

// Типы для SocketContext
export interface CreateOrderData {
    deliveryType: DeliveryType;
    deliveryInfo: IDeliveryInfo;
    paymentMethod: PaymentMethod;
    discount?: number;
}

export interface UpdateStatusData {
    orderId: string;
    newStatus: OrderStatus;
    trackingNumber?: string;
    deliveryDate?: Date;
}

export interface SocketContextType {

}