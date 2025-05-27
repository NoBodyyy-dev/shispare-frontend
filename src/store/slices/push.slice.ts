import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {store} from "../store.ts";

type Message = {
    id: string;
    text: string;
};

type PushMessagesState = {
    messages: Message[];
};

const initialState: PushMessagesState = {
    messages: [],
};

const pushSlice = createSlice({
    name: 'pushMessages',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<string>) => {
            if (state.messages.length >= 10) return;
            const id = Date.now().toString();
            state.messages.push({ id, text: action.payload });

            setTimeout(() => {
                store.dispatch(removeMessage(id));
            }, 4000);
        },
        removeMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter((msg) => msg.id !== action.payload);
        },
    },
});

export const { addMessage, removeMessage } = pushSlice.actions;
export default pushSlice.reducer;