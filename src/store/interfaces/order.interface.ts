import {UserInterface} from "./user.interface.ts";
import {ProductInterface} from "./product.interface.ts";

export enum OrderStatus {
    WAITING_FOR_PAYMENT = "waiting_for_payment", // Ожидает оплаты
    PENDING = "pending",           // Ожидает подтверждения
    PROCESSING = "processing",     // В обработке
    CONFIRMED = "confirmed",       // Подтвержден
    SHIPPED = "shipped",           // Отправлен
    DELIVERED = "delivered",       // Доставлен
    CANCELLED = "cancelled",       // Отменен
    REFUNDED = "refunded"          // Возвращен
}

export enum DeliveryType {
    PICKUP = "pickup",             // Самовывоз
    KRASNODAR = "krasnodar",       // Доставка по краснодару
    RUSSIA = "russia",             // Доставка по России
}

export enum PaymentMethod {
    CARD = "card",                 // Оплата картой
    CASH = "cash",                 // Наличные при получении
    SBP = "sbp",                   // Система быстрых платежей
    INVOICE = "invoice",            // По счету для юр. лиц
    PAYINSHOP = "pay_in_shop"
}

// Интерфейс для элемента заказа
export interface IOrderItem {
    product: string | ProductInterface;       // Ссылка на продукт (может быть ID или объект)
    article?: number;           // Артикул товара
    quantity: number;              // Количество товара
    price?: number;                 // Цена на момент заказа (фиксируем)
    discount?: number;             // Скидка на товар (%)
}

// Интерфейс для данных доставки
export interface IDeliveryInfo {
    city: string;                  // Город
    address: string;               // Адрес
    postalCode?: string;           // Почтовый индекс
    recipientName: string;         // ФИО получателя
    phone: string;                 // Телефон получателя
    comment?: string;              // Комментарий к доставке
}

// Основной интерфейс заказа
export interface IOrder {
    _id: string;
    orderNumber: string;           // Уникальный номер заказа (генерируется)
    owner: UserInterface;          // Пользователь, оформивший заказ
    items: IOrderItem[];           // Состав заказа
    totalAmount: number;           // Общая сумма
    discountAmount: number;        // Сумма скидки
    deliveryCost: number;          // Стоимость доставки
    finalAmount: number;           // Итоговая сумма к оплате
    status: OrderStatus;           // Статус заказа
    deliveryType: DeliveryType;    // Способ доставки
    deliveryInfo: IDeliveryInfo;   // Данные доставки
    paymentMethod: PaymentMethod;  // Способ оплаты
    paymentStatus: boolean;        // Статус оплаты
    invoiceUrl?: string;           // Ссылка на счет/накладную
    trackingNumber?: string;       // Трек-номер для отслеживания
    createdAt: Date;               // Дата создания
    updatedAt: Date;               // Дата обновления
    cancelledAt?: Date;            // Дата отмены
    canceledCaused?: string;       // Причина отмены
    deliveredAt?: Date;            // Дата доставки
    documentUrl: string;
}

export interface OrderState {
    orders: IOrder[];
    currentOrder: IOrder | null;
    isLoadingOrders: boolean;
    isLoadingOrder: boolean;
    isLoadingCreateOrder: boolean;
    successOrders: boolean;
    errorOrders: string;
    errorOrder: string;
    errorCreateOrder: string;
}