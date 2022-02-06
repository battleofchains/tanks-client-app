import { createSlice } from '@reduxjs/toolkit';

type Message = {
	from: string;
	text: string;
};

interface Chat {
	messages: Message[];
}

const initialState: Chat = {
	messages: [],
};

export const ChatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {},
	extraReducers: {
		'socket/room_message': (state, action) => {
			state.messages = [...state.messages, action.payload];
		},
	},
});

export const {} = ChatSlice.actions;

export default ChatSlice.reducer;
