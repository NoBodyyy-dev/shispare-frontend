import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Message = {
    id: string;
    text: string;
    type: 'error' | 'success' | 'warning' | 'info';
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
            state.messages.push({ id, text: action.payload, type: action.type as 'error' | 'success' | 'warning' | 'info' });
        },
        removeMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter((msg) => msg.id !== action.payload);
        },
    },
});

export const { addMessage, removeMessage } = pushSlice.actions;
export default pushSlice.reducer;