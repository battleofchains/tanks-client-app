import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getCookie } from '../tools/cookie';
const urlSearchParams = new URLSearchParams(window.location.search);
let { token } = Object.fromEntries(urlSearchParams.entries());
if (!token) {
	token = getCookie('token');
}
interface User {
	token: string | null | undefined;
	username: string | null | undefined;
	sid: string | null | undefined;
}

// 860e2527e2f231284bb7e43400dbf4bb13be30f5
// 2acc74af37f83c38f1cde048088ee4ef432bc1a3
const initialState: User = {
	token: token || null,
	username: null,
	sid: null,
};

export const UserSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUsername: (state, action) => {
			state.username = action.payload;
		},
	},
	extraReducers: {
		'api/token': (state, action) => {
			state.token = action.payload;
		},
		'socket/joined': (state, action) => {
			const { sid, username } = action.payload;
			if (!state.username) {
				state.username = username;
			}
			if (!state.sid) {
				state.sid = sid;
			}
		},
	},
});

export const { setUsername } = UserSlice.actions;
export const UserSelectors = {
	getToken: (state: RootState) => state.user.token,
	getUsername: (state: RootState) => state.user.username,
};
export default UserSlice.reducer;
