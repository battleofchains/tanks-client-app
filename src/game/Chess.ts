import Phaser from 'phaser';
import { Board, Shape } from 'phaser3-rex-plugins/plugins/board-components.js';
import ChessBody, { Direction } from './ChessBody';
import { MapSize, Tank, Tile } from '../models';
import BaseScene from '../scenes/BaseScene';
import { getHexColorFromString } from '../tools/colors';

export default class Chess extends Shape {
	moveTo: any;
	chessBody: ChessBody;
	shootGridGraphic: Phaser.GameObjects.Graphics;
	walkGridGraphic: Phaser.GameObjects.Graphics;
	username: string | undefined;
	tankId: number | undefined;
	selectActivePlayer: any;
	selectTarget: any;
	tank: Tank;
	scene: BaseScene;
	fillColor: number | null;
	mapSize: MapSize;
	constructor(
		scene: BaseScene,
		tileXY: Tile,
		mapSize: MapSize = { width: 27, height: 22 },
		username?: string,
		tank?: Tank,
	) {
		const color = getHexColorFromString(username);
		console.log('color', color);
		super(scene.board, tileXY.x, tileXY.y, 0, color, 0.2);
		this.mapSize = mapSize;
		this.username = username;
		this.tank = tank;
		this.tankId = tank.id;
		this.scene = scene;
		this.scene.add.existing(this);
		this.chessBody = new ChessBody(
			this.scene,
			this.x,
			this.y,
			tank,
			username,
			color,
		);
		this.chessBody.setDepth(10);
		this.turnToCenter();
		// add behaviors
		// @ts-ignore
		this.moveTo = scene.rexBoard.add.moveTo(this, {
			speed: 300,
			occupiedTest: true,
			blockerTest: true,
		});
		this.selectActivePlayer = this.scene.add.image(
			this.x,
			this.y,
			'select_yellow',
		);
		this.selectTarget = this.scene.add.image(this.x, this.y, 'select_red');
		this.selectTarget.alpha = 0;
	}
	drawSelectActivePlayer(): void {
		this.selectActivePlayer.alpha = 1;
		this.selectActivePlayer.x = this.x;
		this.selectActivePlayer.y = this.y;
	}
	clearSelectActivePlayer(): void {
		this.selectActivePlayer.alpha = 0;
	}
	drawSelectTarget(): void {
		this.selectTarget.alpha = 1;
		this.selectTarget.x = this.x;
		this.selectTarget.y = this.y;
	}
	clearSelectTarget(): void {
		this.selectTarget.alpha = 0;
	}
	canMoveTo(tileX: number, tileY: number) {
		const { stamina } = this.scene.state.players;
		const st = stamina[this.username][this.tankId];
		return (
			this.moveTo.canMoveTo(tileX, tileY) &&
			st >= 0 &&
			st - this.tank.moving_price >= 0
		);
	}
	// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/board-moveto/
	move(tileX: number, tileY: number, stepCallback: any): any {
		// todo: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/board-pathfinder/
		const canMoveTo = this.canMoveTo(tileX, tileY);
		if (!canMoveTo) {
			return;
		}
		const p = new Promise((resolve, reject) => {
			stepCallback({ x: tileX, y: tileY });
			this.moveTo
				.moveCloser(tileX, tileY)
				.once('complete', resolve, this);
		});
		return p.then(() => {
			const { x, y } = this.getCurrentTile();
			const canMoveTo = this.canMoveTo(tileX, tileY);
			if (canMoveTo && (x !== tileX || y !== tileY)) {
				return this.move(tileX, tileY, stepCallback);
			} else {
				return { x, y };
			}
		});
	}
	drawBody() {
		// https://codepen.io/rexrainbow/pen/qvGLPd
		const { selectedEnemy } = this.scene.state.players;
		if (
			this.moveTo.destinationDirection !== null &&
			this.chessBody.direction !==
				Direction[this.moveTo.destinationDirection] &&
			!selectedEnemy
		) {
			this.chessBody.turn(Direction[this.moveTo.destinationDirection]);
		}
		this.chessBody.setX(this.x - 2);
		this.chessBody.setY(this.y - 4);
	}
	drawUI(params: { stamina: number; hp: number; isActive: boolean }) {
		this.chessBody.renderUI(params);
	}
	getCurrentTile() {
		return this.scene.board.grid.getTileXY(this.x, this.y);
	}
	tileInWalkGrid(tile: Tile, stamina: number) {
		const currentPos = this.getCurrentTile();
		const distance = this.scene.board.getDistance(currentPos, tile);
		const turns = stamina / this.tank.moving_price;
		return turns >= distance;
	}
	drawShootGrid() {
		if (this.shootGridGraphic) {
			this.shootGridGraphic.clear();
		}
		this.shootGridGraphic = this.scene.add.graphics({
			lineStyle: {
				width: 6,
				color: 0xbe3523,
				alpha: 0.3,
			},
			fillStyle: {
				color: 0x000000,
				alpha: 0.0,
			},
		});
		this.shootGridGraphic.setDepth(5);
		const currentTile = this.getCurrentTile();
		const { playerTanks, blockersPos } = this.scene;
		const tanksPositions = playerTanks.map((tank: Chess) => {
			return tank.getCurrentTile();
		});
		// console.log(blockersPos);
		const collisions = [...tanksPositions, ...blockersPos];
		const shootTiles = this.scene.board
			.filledRingToTileXYArray(this, this.tank.overlook)
			.filter((tile: Tile) => {
				return !(tile.x === currentTile.x && tile.y === currentTile.y);
			});
		this.drawGridPoints(this.shootGridGraphic, shootTiles, collisions);
	}
	drawWalkGrid(stamina: number) {
		if (this.walkGridGraphic) {
			this.walkGridGraphic.clear();
		}
		this.walkGridGraphic = this.scene.add.graphics({
			fillStyle: {
				color: 0x000000,
				alpha: 0.2,
			},
		});
		const gridSize = Math.floor(stamina / this.tank.moving_price);
		const { board } = this.scene;

		const collisions = this.scene.getCollisions();
		const walkTiles = board.filledRingToTileXYArray(this, gridSize);
		// console.log(walkTiles);
		this.drawGridPoints(this.walkGridGraphic, walkTiles, collisions);
	}
	drawGridPoints(
		graphic: Phaser.GameObjects.Graphics,
		tiles: Tile[],
		collisions: Tile[],
	) {
		const currentTile = this.getCurrentTile();
		tiles
			.filter((tile) => {
				const collisionOnTile = collisions.find(
					(col) => col.x === tile.x && col.y === tile.y,
				);

				return (
					!collisionOnTile &&
					!(tile.x === currentTile.x && tile.y === currentTile.y)
				);
			})
			.forEach(({ x, y }) => {
				const points = this.scene.board.getGridPoints(x, y, true);
				graphic.strokePoints(points, true);
				graphic.fillPoints(points, true);
			});
	}
	clearGrid() {
		if (this.shootGridGraphic) {
			this.shootGridGraphic.clear();
		}
		if (this.walkGridGraphic) {
			this.walkGridGraphic.clear();
		}
	}
	turnToCenter() {
		const center = {
			x: Math.round(this.mapSize.width / 2),
			y: Math.round(this.mapSize.height / 2),
		};
		this.turnOnTile(center);
	}
	turnOnTile(tile: Tile) {
		const pos = this.getCurrentTile();
		console.log('turnOnTile', tile, pos);
		switch (true) {
			case pos.x < tile.x && pos.y < tile.y:
				this.chessBody.turn('downRight');
				break;
			case pos.x > tile.x && pos.y < tile.y:
				this.chessBody.turn('downLeft');
				break;
			case pos.x > tile.x && pos.y > tile.y:
				this.chessBody.turn('upLeft');
				break;
			case pos.x < tile.x && pos.y > tile.y:
				this.chessBody.turn('upRight');
				break;
			case pos.x > tile.x && pos.y === tile.y:
				this.chessBody.turn('left');
				break;
			case pos.x < tile.x && pos.y === tile.y:
				this.chessBody.turn('right');
				break;
			case pos.x === tile.x && pos.y > tile.y:
				this.chessBody.turn('upLeft');
				break;
			case pos.x === tile.x && pos.y < tile.y:
				this.chessBody.turn('downLeft');
				break;
			default:
				this.chessBody.turn('right');
		}
	}
}
