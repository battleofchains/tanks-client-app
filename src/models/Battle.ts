import { createSlice } from '@reduxjs/toolkit';
import { BattleType, Position } from './index';
import { Map } from './index';

export const status = {
	WAITING: 'waiting',
	RUNNING: 'running',
	FINISHED: 'finished',
};

interface Battle {
	duration?: number;
	turn?: number;
	// @ts-ignore
	status?: status.WAITING | status.RUNNING | status.FINISHED;
	aim: Boolean;
	battleTypes: BattleType[];
	battleType: BattleType | null;
	battlePlayerNumber: null | number;
	battleTankNumber: null | number;
	inLobby: boolean;
	inBattle: boolean;
	inLeaderboard: boolean;
	beforeStart: number | null;
	map: Map | null;
	selectedTile: Position;
	changeTurn: boolean;
	testBattle: boolean;
}

const initialState: Battle = {
	duration: 0,
	turn: 1,
	status: status.RUNNING,
	aim: false,
	battleTypes: [],
	battleType: null,
	battlePlayerNumber: null,
	battleTankNumber: null,
	inLobby: false,
	inBattle: false,
	inLeaderboard: false,
	beforeStart: null,
	map: null,
	selectedTile: null,
	changeTurn: false,
	testBattle: false,
};
export const BattleSlice = createSlice({
	name: 'battle',
	initialState,
	reducers: {
		enableAim: (state) => {
			state.aim = true;
		},
		disableAim: (state) => {
			state.aim = false;
		},
		selectBattleType: (state, action) => {
			const battleType = state.battleTypes.find(
				(b) => b.name === action.payload,
			);
			if (battleType) {
				state.battleType = battleType;
			}
		},
		setBattleParams: (state, action) => {
			const { battlePlayerNumber, battleTankNumber } = action.payload;
			state.battlePlayerNumber = battlePlayerNumber;
			state.battleTankNumber = battleTankNumber;
		},
		selectTile: (state, action) => {
			state.selectedTile = action.payload;
		},
		turnChangingOn: (state, action) => {
			state.changeTurn = true;
		},
		startTestBattle: (state, action) => {
			state.testBattle = true;
		},
		stopTestBattle: (state, action) => {
			state.testBattle = false;
		},
		disableLeaderboard: (state, action) => {
			state.inLeaderboard = false;
		},
	},
	extraReducers: {
		'socket/select_battle': (state, action) => {
			state.battleTypes = action.payload.battle_types;
			if (!state.battleType) {
				state.battleType = action.payload.battle_types[0];
			}
		},
		'socket/joined': (state, action) => {
			const { map } = action.payload;
			state.inLobby = true;
			state.map = map;
		},
		'socket/start': (state, action) => {
			state.inLobby = false;
			state.inBattle = true;
			state.beforeStart = action.payload.t_minus;
		},
		'socket/make_move': (state, action) => {
			state.changeTurn = false;
			state.beforeStart = null;
			state.duration = action.payload.t_minus;
		},

		'socket/turn': (state, action) => {
			state.changeTurn = true;
			state.turn += 1;
		},
		'socket/win': (state, action) => {
			state.inBattle = false;
			state.inLobby = false;
			state.inLeaderboard = true;
		},
	},
});

export const {
	enableAim,
	disableAim,
	selectBattleType,
	selectTile,
	startTestBattle,
	stopTestBattle,
	setBattleParams,
	disableLeaderboard,
} = BattleSlice.actions;

export default BattleSlice.reducer;
