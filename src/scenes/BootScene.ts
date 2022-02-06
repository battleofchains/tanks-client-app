import 'phaser';

export default class BootScene extends Phaser.Scene {
	constructor() {
		super('Boot');
	}

	preload() {
		console.log('boot scene');
	}

	create() {
		this.scene.start('Game');
	}
}
