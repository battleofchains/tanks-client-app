export type Player = {
	username: string;
	tanks: Tank[];
};

export type Tank = {
	armor: number;
	block_chance: number;
	critical_chance: number;
	damage_bonus: number;
	hp: number;
	id: number;
	image: null | string;
	menu_image: null | string;
	level: number;
	moving_price: number;
	name: null | string;
	overlook: number;
	owner: number;
	sprite: null | string;
	hull_sprite: null | string;
	type: {
		id: number;
		name: string;
		image: string;
	};
	country: {
		id: number;
		name: string;
		image: string;
	};
};

export type BattleType = {
	name: 'pvp' | 'team' | 'royale';
	players_number: number;
	player_tanks_number: number;
};
export type Position = {
	x: number;
	y: number;
};

export type Tile = {
	x: number;
	y: number;
	index?: number;
};

export type User = {
	username: string;
	squad: Squad;
};

export type Map = {
	id: number;
	json_file: string;
	name: string;
	sprite_file: string;
};

type MapSize = {
	width: number;
	height: number;
};
