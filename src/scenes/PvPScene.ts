import Phaser from 'phaser';
import { Board } from 'phaser3-rex-plugins/plugins/board-components.js';
import Chess from '../game/Chess';
import store, { RootState } from '../store';
import { EnhancedStore } from '@reduxjs/toolkit/src/configureStore';
import { Tile } from '../models';
import { setStamina } from '../models/Players';
import BaseScene from './BaseScene';

export default class PvPScene extends BaseScene {
	map: Phaser.Tilemaps.Tilemap;
	player: Chess;
	enemies: Chess[] = [];
	turn: number = 1;
	grid: Phaser.GameObjects.Grid;
	board: Board;
	gameStore: EnhancedStore;
	state: RootState;
	username: string | null | undefined;
	constructor() {
		super({ key: 'Game' });
		this.gameStore = store;
		this.state = store.getState();
		this.username = this.state.user.username;
	}
	preload() {
		const path =
			process.env.NODE_ENV === 'production'
				? // @ts-ignore
				  STATIC_URL
				: '.';
		super.preload(path);
		this.load.image(
			'tiles',
			// @ts-ignore
			`${APP_URL}${this.state.battle.map.sprite_file}`,
			//'https://test.battleofchains.com/media/maps/test_map/tileset.png',
			//'tiles/purple.png',
		);
		this.load.tilemapTiledJSON(
			'map',
			// @ts-ignore
			`${APP_URL}${this.state.battle.map.json_file}`,
			//'https://test.battleofchains.com/media/maps/test_map/hex.json',
			//'maps/hex-p.json',
		);
		// @ts-ignore
		store.subscribe((listener: any) => {
			this.state = store.getState();
		});
	}
	create() {
		super.create({ width: 27, height: 22 });
	}

	update(time: any, delta: any) {
		super.update(time, delta);
	}

	afterMove(playerTank: Chess, tileXY: Tile) {
		super.afterMove(playerTank, tileXY);
		const { activeTank } = this.state.players;
		store.dispatch({
			type: 'socket',
			meta: { event: 'move' },
			payload: {
				username: this.username,
				tank: activeTank,
				position: tileXY,
			},
		});
	}
}
