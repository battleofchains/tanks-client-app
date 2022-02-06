import { Shape, Board } from 'phaser3-rex-plugins/plugins/board-components.js';
type Tile = {
	x: number;
	y: number;
};

export default class Blocker extends Shape {
	constructor(board: Board, tileXY: Tile) {
		const scene = board.scene;
		if (tileXY === undefined) {
			tileXY = board.getRandomEmptyTileXY(0);
		}
		// Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
		super(board, tileXY.x, tileXY.y, 0, 0x555555, 0);
		scene.add.existing(this);
	}
}
