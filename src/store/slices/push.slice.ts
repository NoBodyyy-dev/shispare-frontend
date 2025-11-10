import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Message = {
    id: string;
    text: string;
    type: 'error' | 'success' | 'warning' | 'info';
    createdAt: number;
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
            // payload may be a simple string or an object { text, type }
            addMessage: (state, action: PayloadAction<string | { text: string; type?: Message['type'] }>) => {
                if (state.messages.length >= 10) return;
                const id = Date.now().toString() + Math.random().toString(36).slice(2, 7);
                const payload = action.payload;
                let text = '';
                let type: Message['type'] = 'info';

                if (typeof payload === 'string') {
                    text = payload;
                } else if (payload && typeof payload === 'object') {
                    text = payload.text;
                    if (payload.type) type = payload.type;
                }

                state.messages.push({ id, text, type, createdAt: Date.now() });
            },
        removeMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter((msg) => msg.id !== action.payload);
        },
    },
});

export const { addMessage, removeMessage } = pushSlice.actions;
export default pushSlice.reducer;