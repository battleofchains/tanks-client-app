import Phaser from 'phaser';
import { Board } from 'phaser3-rex-plugins/plugins/board-components.js';
import Blocker from '../game/Blocker';
import { MapSize, Player, Tank, Tile } from '../models';
import AppBoard from '../game/Board';
import store, { RootState } from '../store';
import { EnhancedStore } from '@reduxjs/toolkit/src/configureStore';
import Chess from '../game/Chess';
import {
	setHp,
	setPos,
	setStamina,
	setSelectedEnemy,
	clearSelectedEnemy,
} from '../models/Players';
import { enableAim, disableAim } from '../models/Battle';
import { watchStore } from '../tools/watchStore';
import SoundManager from '../game/SoundManager';
import CameraManager from '../game/CameraManager';

const defaultFrameConfig = {
	margin: 0,
	frameWidth: 242,
	frameHeight: 242,
};

export default class BaseScene extends Phaser.Scene {
	map: Phaser.Tilemaps.Tilemap;
	board: Board;
	state: RootState;
	gameStore: EnhancedStore;
	username: string | null | undefined;
	playerTanks: Chess[] = [];
	enemies: Chess[] = [];
	isDrag: boolean = false;
	playerMoving: boolean;
	groundLayer: Phaser.Tilemaps.TilemapLayer;
	startPosLayer: Phaser.Tilemaps.TilemapLayer;
	blockersLayer: Phaser.Tilemaps.TilemapLayer;
	overGroundLayer: Phaser.Tilemaps.TilemapLayer;
	blockersPos: Tile[];
	soundManager: SoundManager;
	cameraManager: CameraManager;
	selectedTile: Phaser.GameObjects.Graphics;
	constructor(conf: any) {
		super(conf);
		this.gameStore = store;
		this.state = store.getState();
		this.soundManager = new SoundManager(this);
		this.cameraManager = new CameraManager(this);
	}
	preload(path: string = '.') {
		// @ts-ignore
		store.subscribe((listener: any) => {
			this.state = store.getState();
		});
		this.load.image('select_yellow', `${path}/select_yellow.png`);
		this.load.image('select_red', `${path}/select_red.png`);
		this.load.image('bullet', `${path}/bullet.png`);
		this.load.image('background', `${path}/frame.png`);
		this.load.spritesheet('fire', `${path}/explosion.png`, {
			frameWidth: 256,
			frameHeight: 248,
		});
		this.load.spritesheet('smoke', `${path}/smoke.png`, {
			frameWidth: 92,
			frameHeight: 92,
		});
		this.soundManager.loadSounds(path);
		this.loadTanksSprites();
		// @ts-ignore
		window.scene = this;
	}
	create(mapSize: MapSize) {
		const cellWidth = 120;
		const cellHeight = 96;
		this.createMap(cellWidth, cellHeight, mapSize.width, mapSize.height);
		// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/fsm/
		const storeMonitor = [
			{
				objectPath: `players.positions`,
				onChange: this.updatePositions.bind(this),
			},
		];
		watchStore(store, storeMonitor);
		this.createPlayers(this.state.players.data, mapSize);
		console.log('create');
		this.cameraManager.createCamera();
		this.soundManager.createSounds();
		this.anims.create({
			key: 'expl',
			frames: this.anims.generateFrameNumbers('fire', { start: 0 }),
			frameRate: 16,
		});
		this.anims.create({
			key: 'smoke',
			frames: this.anims.generateFrameNumbers('smoke', { start: 0 }),
			frameRate: 16,
			delay: 200,
			repeat: -1,
		});

		this.board.on('tiledown', this.handleTileDown.bind(this));
		this.board.on('tileover', this.handleTileOver.bind(this));
		this.board.on('tileout', this.handleTileOut.bind(this));
	}
	update(time: any, delta: any) {
		this.cameraManager.updateCamera();
		this.drawGrid();
		this.drawSelects();
	}
	loadTanksSprites() {
		const _self = this;
		const playersData = this.state.players.data;
		playersData.forEach((player: Player) => {
			player.tanks.forEach((tank) => {
				// console.log(`${tank.id}`, `${path}${tank.sprite}`);
				_self.load.spritesheet(
					`tank_sprite_${tank.id}`,
					// @ts-ignore
					`${APP_URL}${tank.sprite}`,
					defaultFrameConfig,
				);
				_self.load.spritesheet(
					`tank_sprite_hull_${tank.id}`,
					// @ts-ignore
					`${APP_URL}${tank.hull_sprite}`,
					defaultFrameConfig,
				);
			});
		});
	}
	createMap(
		cellWidth: number,
		cellHeight: number,
		mapWidth: number,
		mapHeight: number,
	) {
		this.map = this.make.tilemap({
			key: 'map',
			tileWidth: cellWidth,
			tileHeight: cellHeight,
		});
		const hextileset = this.map.addTilesetImage('tileset', 'tiles');
		this.groundLayer = this.map.createLayer('GroundLayer', hextileset);
		this.blockersLayer = this.map.createLayer('BlockersLayer', hextileset);
		this.startPosLayer = this.map.createLayer('StartPosLayer', hextileset);
		this.overGroundLayer = this.map.createLayer(
			'OnGroundLayer',
			hextileset,
		);
		this.add.image(1660, 880, 'background');
		this.blockersLayer.setDepth(100);
		this.overGroundLayer.setDepth(200);
		this.createBoard(cellWidth, cellHeight, mapWidth, mapHeight);
		this.createBlockersLayer();
	}
	createBoard(
		cellWidth: number,
		cellHeight: number,
		mapWidth: number,
		mapHeight: number,
	) {
		this.board = new AppBoard(this, {
			grid: {
				gridType: 'hexagonGrid',
				x: cellWidth / 2,
				y: 170,
				cellWidth,
				cellHeight: cellHeight - 1,
				staggeraxis: 'x', // 'x'|'y'
				staggerindex: 'odd', // 'odd'|'even'
			},
			width: mapWidth,
			height: mapHeight,
		});
	}
	createBlockersLayer() {
		if (this.blockersLayer) {
			this.blockersPos = this.getLayerTiles(
				this.blockersLayer.layer.data,
			);
			this.blockersPos.forEach((tileXY) => {
				new Blocker(this.board, tileXY);
			});
		}
	}
	getLayerTiles(data: Tile[][]) {
		let res: Tile[] = [];
		data.forEach((row) => {
			res = [...res, ...row.filter((t) => t.index >= 0)];
		});
		return res.map((t) => ({ x: t.x, y: t.y }));
	}
	createPlayers(playersList: any[], mapSize: MapSize) {
		let i = 0;
		const startPosCoords = this.getLayerTiles(
			this.startPosLayer.layer.data,
		).sort((a, b) => {
			return a.x - b.x + a.y - b.y;
		});
		console.log('playersList', playersList);
		playersList.forEach((playerData: any) => {
			playerData.tanks.forEach((tank: Tank) => {
				const startPos = startPosCoords[i++];
				if (!startPos) {
					return;
				}
				store.dispatch(
					setStamina({
						username: playerData.username,
						tank: tank.id,
						value: 10,
					}),
				);
				store.dispatch(
					setHp({
						username: playerData.username,
						tank: tank.id,
						value: tank.hp,
					}),
				);
				store.dispatch(
					setPos({
						username: playerData.username,
						tank: tank.id,
						position: startPos,
					}),
				);
				const tankChess = new Chess(
					this,
					startPos,
					mapSize,
					playerData.username,
					tank,
				);
				if (playerData.username === this.username) {
					this.playerTanks.push(tankChess);
				} else {
					this.enemies.push(tankChess);
					tankChess.setInteractive();
					tankChess.on('pointerdown', () =>
						this.selectTargetEnemy(tankChess),
					);
				}
			});
			console.log('player', this.playerTanks);
			console.log('enemies', this.enemies);
		});
	}
	afterMove(playerTank: Chess, tileXY: Tile) {
		const { stamina } = this.state.players;
		store.dispatch(
			setStamina({
				username: this.username,
				tank: playerTank.tankId,
				value:
					stamina[this.username][playerTank.tankId] -
					playerTank.tank.moving_price,
			}),
		);
	}
	handleTileDown(pointer: any, tileXY: Tile) {
		const { activePlayer, activeTank, stamina } = this.state.players;
		store.dispatch(disableAim());
		const playerTank = this.playerTanks.find(
			(t) => t.tankId === activeTank,
		);
		if (this.isDrag || activePlayer !== this.username || !playerTank) {
			return;
		}
		const playerTankPos = playerTank.getCurrentTile();
		const isCurrentTile =
			playerTankPos.x === tileXY.x && playerTankPos.y === tileXY.y;
		if (isCurrentTile) {
			return;
		}
		if (
			!playerTank.tileInWalkGrid(
				tileXY,
				stamina[activePlayer][activeTank],
			)
		) {
			return;
		}
		this.playerMoving = true;
		store.dispatch(clearSelectedEnemy());
		const move = playerTank.move(tileXY.x, tileXY.y, (pos: Tile) => {
			this.afterMove(playerTank, pos);
		});
		if (!move) {
			console.log('cant move');
			this.playerMoving = false;
			return;
		}
		if (this.soundManager.sounds.walk.isPaused) {
			this.soundManager.sounds.walk.resume();
		} else {
			this.soundManager.sounds.walk.play();
		}
		move.then((tileXY: Tile) => {
			this.playerMoving = false;
			this.soundManager.sounds.walk.pause();
		});
	}
	handleTileOver(pointer: any, tileXY: Tile) {
		console.log('tile over', tileXY);
		if (this.selectedTile) {
			this.selectedTile.clear();
		}
		const { activePlayer, activeTank, stamina } = this.state.players;
		if (activePlayer !== this.username) {
			return;
		}
		const collisions = this.getCollisions();
		const tank = this.playerTanks.find(
			(tank) => tank.tankId === activeTank,
		);
		const inWalkGrid = tank.tileInWalkGrid(
			tileXY,
			stamina[activePlayer][activeTank],
		);
		const isCollided = collisions.find(
			(tile) => tile.x === tileXY.x && tile.y === tileXY.y,
		);
		if (isCollided || !inWalkGrid) {
			return;
		}
		this.selectedTile = this.add.graphics({
			fillStyle: {
				color: 0x000000,
				alpha: 0.3,
			},
		});
		const points = this.board.getGridPoints(tileXY.x, tileXY.y, true);
		this.selectedTile.fillPoints(points, true);
	}
	handleTileOut(pointer: any, tileXY: Tile) {
		if (this.selectedTile) {
			this.selectedTile.clear();
		}
	}
	getCollisions(includeEnemy?: boolean) {
		const { enemies, playerTanks, blockersPos } = this;
		let tanks = playerTanks;
		if (includeEnemy) {
			tanks = [...playerTanks, ...enemies];
		}
		const tanksPositions = tanks.map((tank: Chess) => {
			return tank.getCurrentTile();
		});
		return [...tanksPositions, ...blockersPos];
	}
	selectTargetEnemy(enemy: Chess) {
		const { activeTank, hp } = this.state.players;
		const playerTank = this.playerTanks.find(
			(t) => t.tankId === activeTank,
		);
		if (!playerTank || !enemy) {
			return;
		}
		const tankHP = hp[enemy.username][enemy.tankId];
		if (tankHP <= 0) {
			return;
		}
		const playerPos = playerTank.getCurrentTile();
		const enemyPos = enemy.getCurrentTile();
		const distance = this.board.getDistance(playerPos, enemyPos);
		if (distance > playerTank.tank.overlook) {
			console.log('cant shoot to distance');
			return;
		}
		playerTank.turnOnTile(enemyPos);
		store.dispatch(enableAim());
		store.dispatch(
			setSelectedEnemy({
				username: enemy.username,
				tank: enemy.tankId,
			}),
		);
	}
	updatePositions(newVal: any, oldVal: any, objectPath: string) {
		const { activePlayer } = this.state.players;
		//debugger;
		this.enemies
			.filter((enemy) => enemy.username === activePlayer)
			.forEach((enemy) => {
				const newEnemyPos = newVal[enemy.username][enemy.tankId];
				const oldEnemyPos = oldVal[enemy.username][enemy.tankId];
				if (
					oldEnemyPos &&
					newEnemyPos.x === oldEnemyPos.x &&
					newEnemyPos.y === oldEnemyPos.y
				) {
					return;
				}
				const move = enemy.move(
					newEnemyPos.x,
					newEnemyPos.y,
					(pos: Tile) => {
						const { stamina } = this.state.players;
						const newStamina =
							stamina[enemy.username][enemy.tankId] -
							enemy.tank.moving_price;
						console.log(
							`${enemy.username} move to ${pos.x},${pos.y}`,
							`st: ${newStamina}`,
						);

						store.dispatch(
							setStamina({
								username: enemy.username,
								tank: enemy.tankId,
								value: newStamina,
							}),
						);
					},
				);
				if (!move) {
					return;
				}
				if (this.soundManager.sounds.walk.isPaused) {
					this.soundManager.sounds.walk.resume();
				} else {
					this.soundManager.sounds.walk.play();
				}
				move.then(() => {
					this.soundManager.sounds.walk.pause();
				});
			});
	}
	drawGrid() {
		const { activePlayer, activeTank, stamina } = this.state.players;
		const { aim } = this.state.battle;
		if (!this.playerTanks) {
			return;
		}
		this.playerTanks.forEach((tank) => {
			tank.clearGrid();
			if (tank.tankId === activeTank) {
				if (aim) {
					tank.drawShootGrid();
				}
				tank.drawWalkGrid(stamina[activePlayer][activeTank]);
			}
		});
	}
	drawSelects() {
		const {
			selectedEnemy,
			activePlayer,
			activeTank,
			stamina,
			hp,
		} = this.state.players;
		const { aim } = this.state.battle;
		const tanksChess = [...this.playerTanks, ...this.enemies];
		tanksChess.forEach((tank) => {
			const params = {
				stamina: stamina[tank.username][tank.tankId],
				hp: hp[tank.username][tank.tankId],
				isActive:
					tank.tankId === activeTank &&
					tank.username === activePlayer,
			};
			tank.drawBody();
			tank.drawUI(params);
			if (params.isActive) {
				tank.drawSelectActivePlayer();
			} else {
				tank.clearSelectActivePlayer();
			}
			if (
				aim &&
				selectedEnemy &&
				hp[tank.username][tank.tankId] > 0 &&
				tank.username === selectedEnemy.username &&
				tank.tankId === selectedEnemy.tank
			) {
				tank.drawSelectTarget();
			} else {
				tank.clearSelectTarget();
			}
		});
	}

	setIsDrag(val: boolean) {
		this.isDrag = val;
	}
}
