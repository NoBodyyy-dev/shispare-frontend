import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Socket} from "socket.io-client";
import {IOrder} from "../interfaces/socket.interface.ts";

interface SocketState {
    socket: Socket | null;
    isConnected: boolean;
    reconnectAttempts: number;
    connectionError: string | null;
    onlineAdmins: string[];
    orders: IOrder[]
}

const initialState: SocketState = {
    socket: null,
    isConnected: false,
    reconnectAttempts: 0,
    connectionError: null,
    onlineAdmins: [],
    orders: []
};

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setOrders: (state, action) => {
            state.orders = action.payload.orders;
        },
        setConnectionStatus: (state, action: PayloadAction<{ isConnected: boolean }>) => {
            state.isConnected = action.payload.isConnected;
        },
        setReconnectAttempts: (state, action: PayloadAction<{ attempts: number }>) => {
            state.reconnectAttempts = action.payload.attempts;
        },
        setConnectionError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.connectionError = action.payload.error;
        },
        incrementReconnectAttempts: (state) => {
            state.reconnectAttempts += 1;
        },
        resetConnectionState: (state) => {
            state.reconnectAttempts = 0;
            state.connectionError = null;
        },
        setOnlineAdmins: (state, action: PayloadAction<{ onlineAdmins: string[] }>) => {
            state.onlineAdmins = action.payload.onlineAdmins;
            console.log('onlineAdmins: ', state.onlineAdmins);
            console.log(action.payload)
        },
        clearSocket: (state) => {
            if (state.socket) {
                state.socket.disconnect();
            }
            state.socket = null;
            state.isConnected = false;
            state.reconnectAttempts = 0;
            state.connectionError = null;
        }
    },
});

export const {
    setSocket,
    setOrders,
    setConnectionStatus,
    setReconnectAttempts,
    setConnectionError,
    incrementReconnectAttempts,
    resetConnectionState,
    setOnlineAdmins,
    clearSocket
} = socketSlice.actions;
export default socketSlice.reducer;