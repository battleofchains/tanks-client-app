import { createSlice } from '@reduxjs/toolkit';

interface ApiState {
	users: [];
	tanks: [];
	squads: [];
	projectiles: [];
	error: null | string | Error;
}

const initialState: ApiState = {
	users: [],
	tanks: [],
	squads: [],
	projectiles: [],
	error: null,
};

export const ApiSlice = createSlice({
	name: 'api',
	initialState,
	reducers: {},
	extraReducers: {
		'api/receive': (state, action) => {
			const { url, data } = action.payload;
			// @ts-ignore
			state[url] = data;
		},
		'api/error': (state, action) => {
			state.error = action.payload;
		},
	},
});

export const {} = ApiSlice.actions;

export default ApiSlice.reducer;
