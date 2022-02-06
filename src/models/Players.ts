import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Player, Tank } from './index';

interface Players {
	positions: any;
	hp: any;
	stamina: any;
	data: any;
	activePlayer: string | null | undefined;
	activeTank: number | null | undefined;
	playerTanks: any;
	winner: string | null;
	selectedEnemy: null | {
		username: string;
		tank: number;
	};
	leftPlayers: string[];
}

const initialState: Players = {
	positions: {},
	hp: {},
	stamina: {},
	data: [],
	activePlayer: null,
	activeTank: null,
	playerTanks: [],
	selectedEnemy: null,
	winner: null,
	leftPlayers: [],
};

const setStats = {
	setPos: (state: any, action: any) => {
		const { username, tank, position } = action.payload;
		if (!state.positions[username]) {
			state.positions[username] = {};
		}
		state.positions[username][tank] = position;
	},
	setHp: (state: any, action: any) => {
		const { username, tank, value } = action.payload;
		if (!state.hp[username]) {
			state.hp[username] = {};
		}
		state.hp[username][tank] = parseInt(value) >= 0 ? parseInt(value) : 0;
	},
	setStamina: (state: any, action: any) => {
		const { username, tank, value } = action.payload;
		if (!state.stamina[username]) {
			state.stamina[username] = {};
		}
		state.stamina[username][tank] =
			parseInt(value) >= 0 ? parseInt(value) : 0;
	},
};

export const PlayersSlice = createSlice({
	name: 'players',
	initialState,
	reducers: {
		...setStats,
		createTestPlayers: (state, action) => {
			const { data, activePlayer, activeTank } = action.payload;
			state.data = data;
			state.activePlayer = activePlayer;
			state.activeTank = activeTank;
		},
		clearTestPlayers: (state, action) => {
			const {
				positions,
				hp,
				stamina,
				data,
				activePlayer,
				activeTank,
			} = initialState;
			state.positions = positions;
			state.hp = hp;
			state.stamina = stamina;
			state.data = data;
			state.activePlayer = activePlayer;
			state.activeTank = activeTank;
		},
		setActivePlayer: (state, action) => {
			const { username, tank } = action.payload;
			state.activePlayer = username;
			if (tank) {
				state.activeTank = tank;
			}
		},
		setSelectedEnemy: (state, action) => {
			const { username, tank } = action.payload;
			state.selectedEnemy = {
				username,
				tank,
			};
		},
		clearSelectedEnemy: (state) => {
			state.selectedEnemy = null;
		},
	},
	extraReducers: {
		'socket/joined': (state, action) => {
			const { users_data } = action.payload;
			state.leftPlayers = [];
			state.data = Object.keys(users_data).map((username) => ({
				username,
				...users_data[username],
			}));
		},
		'socket/select_tanks': (state, action) => {
			const { tanks } = action.payload;
			state.playerTanks = tanks;
		},
		'socket/make_move': (state, action) => {
			const { current_player } = action.payload;
			state.activePlayer = current_player.username;
			state.activeTank = current_player.tank;
		},
		'socket/move': (state, action) => {
			const { username, tank, position } = action.payload;
			state.positions[username][tank] = position;
		},
		'socket/shoot': (state, action) => {
			const { username, tank, target, dmg } = action.payload;
			if (state.stamina[username][tank] >= 2) {
				state.stamina[username][tank] -= 2;
				state.hp[target.username][target.tank] -= dmg;
				if (state.hp[target.username][target.tank] - dmg > 0) {
					state.hp[target.username][target.tank] -= dmg;
				} else {
					state.hp[target.username][target.tank] = 0;
				}
			}
		},
		'socket/left': (state, action) => {
			// left {sid: '6HXS_vR1RE9USp_kAAA1', username: 'coding774932', users: Array(1)}
			const { username } = action.payload;
			state.leftPlayers.push(username);
			state.data = state.data.filter(
				(player: Player) => player.username !== username,
			);
		},
		'socket/turn': (state, action) => {
			const { username } = action.payload;
			state.selectedEnemy = null;
			state.data
				.filter((u: any) => u.username !== username)
				.forEach((u: any) => {
					u.tanks.forEach((tank: Tank) => {
						state.stamina[u.username][tank.id] = 10;
					});
				});
		},
		'socket/win': (state, action) => {
			const { winner } = action.payload;
			state.winner = winner;
		},
	},
});

export const {
	setPos,
	setHp,
	setStamina,
	setActivePlayer,
	setSelectedEnemy,
	clearSelectedEnemy,
	createTestPlayers,
	clearTestPlayers,
} = PlayersSlice.actions;

export const PlayersSelectors = {
	getActivePlayerTanks: (state: RootState) => {
		const { data, activePlayer, activeTank } = state.players;
		if (!data || !data.length) {
			return;
		}
		const player = data.find((u: Player) => u.username === activePlayer);
		if (!player) {
			return;
		}
		return player.tanks;
	},
	getWinnerPlayerTanks: (state: RootState) => {
		const { data, activePlayer, activeTank } = state.players;
		if (!data || !data.length) {
			return;
		}
		const player = data.find((u: Player) => u.username === activePlayer);
		if (!player) {
			return;
		}
		return player.tanks;
	},
	getActiveTank: (state: RootState) => {
		const { data, activePlayer, activeTank } = state.players;
		if (!data || !data.length) {
			return;
		}
		const player = data.find((u: Player) => u.username === activePlayer);
		if (!player) {
			return;
		}
		return player.tanks.find((t: Tank) => t.id === activeTank);
	},
	getSelectedTank: (state: RootState) => {
		const { data, selectedEnemy } = state.players;
		if (!data || !data.length) {
			return;
		}
		if (!selectedEnemy) {
			return;
		}
		const player = data.find(
			(u: Player) => u.username === selectedEnemy.username,
		);
		if (!player) {
			return;
		}
		return player.tanks.find((t: Tank) => t.id === selectedEnemy.tank);
	},
};
export default PlayersSlice.reducer;
