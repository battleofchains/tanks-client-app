import Phaser from 'phaser';
import BaseScene from '../scenes/BaseScene';
import PvPScene from '../scenes/PvPScene';
import TestScene from '../scenes/TestScene';

export default class CameraManager {
	scene: BaseScene | PvPScene | TestScene;
	zoomLevel: number = 0.7;
	constructor(scene: BaseScene | PvPScene | TestScene) {
		this.scene = scene;
	}
	createCamera() {
		const _self = this;
		this.scene.cameras.main.setZoom(this.zoomLevel);
		this.scene.cameras.main.setBounds(
			-340,
			-105,
			this.scene.map.widthInPixels + 760,
			this.scene.map.heightInPixels - 80,
		);
		if (this.scene.playerTanks.length) {
			this.scene.cameras.main.centerOn(
				this.scene.playerTanks[0].x,
				this.scene.playerTanks[0].y,
			);
		} else {
			this.scene.cameras.main.centerOn(0, 0);
		}

		this.scene.input.on(
			Phaser.Input.Events.POINTER_DOWN,
			function (pointer: any) {
				_self.scene.setIsDrag(true);
			},
			this,
		);
		this.scene.input.on(
			Phaser.Input.Events.POINTER_UP,
			function (pointer: any) {
				_self.scene.setIsDrag(false);
			},
			this,
		);
		this.scene.input.on(
			Phaser.Input.Events.POINTER_MOVE,
			function (p: any) {
				if (!p.isDown) return;
				_self.scene.cameras.main.scrollX -=
					(p.x - p.prevPosition.x) / _self.scene.cameras.main.zoom;
				_self.scene.cameras.main.scrollY -=
					(p.y - p.prevPosition.y) / _self.scene.cameras.main.zoom;
			},
			this,
		);
		this.scene.input.on(Phaser.Input.Events.POINTER_WHEEL, function (
			pointer: any,
			gameObjects: any,
			deltaX: number,
			deltaY: number,
		) {
			const newZoom = _self.zoomLevel + deltaY * 0.0005 * -1;
			if (newZoom > 0.5 && newZoom < 1.3) {
				_self.zoomLevel = newZoom;
				_self.scene.cameras.main.setZoom(_self.zoomLevel);
			}
		});
	}
	updateCamera() {
		const { activeTank } = this.scene.state.players;
		if (this.scene.isDrag) {
			return;
		}
		if (this.scene.playerMoving) {
			const activePlayerTank = this.scene.playerTanks.find(
				(t) => t.tankId === activeTank,
			);

			if (activePlayerTank) {
				this.scene.cameras.main.centerOn(
					activePlayerTank.x,
					activePlayerTank.y,
				);
			} else {
				if (this.scene.playerTanks.length) {
					this.scene.cameras.main.centerOn(
						this.scene.playerTanks[0].x,
						this.scene.playerTanks[0].y,
					);
				} else {
					this.scene.cameras.main.centerOn(0, 0);
				}
			}
		}
	}
}
