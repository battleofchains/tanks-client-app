import store from '../store';
import Chess from '../game/Chess';
import BaseScene from './BaseScene';
import { setHp, setPos, setStamina } from '../models/Players';
import { watchStore } from '../tools/watchStore';

export default class TestScene extends BaseScene {
	constructor() {
		super({ key: 'TestScene' });
		this.username = 'testUser';
	}
	preload() {
		const path =
			process.env.NODE_ENV === 'production'
				? // @ts-ignore
				  STATIC_URL
				: '.';

		super.preload(path);
		this.load.image('tiles', `${path}/tiles/tileset.png`);
		this.load.tilemapTiledJSON('map', `${path}/maps/test.json`);
	}
	create() {
		super.create({ width: 10, height: 7 });
	}

	update(time: any, delta: any) {
		super.update(time, delta);
	}
}
