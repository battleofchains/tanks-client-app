import Phaser from 'phaser';
import { Board } from 'phaser3-rex-plugins/plugins/board-components.js';

class AppBoard extends Board {
	constructor(scene: Phaser.Scene, config: Object) {
		// create board
		super(scene, config);
		// draw grid
		const graphics = scene.add.graphics({
			lineStyle: {
				width: 1,
				color: 0xffffff,
				alpha: 0,
			},
		});
		this.setInteractive();
		this.forEachTileXY(function (tileXY, board) {
			const points = board.getGridPoints(tileXY.x, tileXY.y, true);
			graphics.strokePoints(points, true);
		});
	}
}

export default AppBoard;
