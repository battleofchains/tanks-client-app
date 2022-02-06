import Phaser from 'phaser';

export default class SoundManager {
	scene: Phaser.Scene;
	sounds: {
		walk: Phaser.Sound.BaseSound | undefined;
		expl: Phaser.Sound.BaseSound | undefined;
	};
	constructor(scene: Phaser.Scene) {
		this.scene = scene;
		this.sounds = {
			walk: undefined,
			expl: undefined,
		};
	}
	loadSounds(path: string) {
		this.scene.load.audio('walk', [
			`${path}/sounds/walk.ogg`,
			`${path}/sounds/walk.mp3`,
		]);
		this.scene.load.audio('expl', [
			`${path}/sounds/expl.ogg`,
			`${path}/sounds/expl.mp3`,
		]);
	}
	createSounds() {
		this.sounds.walk = this.scene.sound.add('walk', {
			volume: 0.1,
			loop: true,
		});
		this.sounds.expl = this.scene.sound.add('expl', { volume: 0.7 });
	}
}
