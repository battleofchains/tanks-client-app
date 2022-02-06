import Phaser from 'phaser';
import { Tank } from '../models';
import BaseScene from '../scenes/BaseScene';
// https://habr.com/ru/post/563294/
const barHeight = 16;
const barOffset = 50;
const textCommonStyle = {
	fontFamily: 'Roboto, Arial, sans-serif',
	fontSize: `${barHeight - 2}px`,
};
/*
	0 : Right
	1 : Down-right
	2 : Down-left
	3 : Left
	4 : Up-left
	5 : Up-right
	 */
export const Direction = [
	'right',
	'downRight',
	'downLeft',
	'left',
	'upLeft',
	'upRight',
];

export default class ChessBody extends Phaser.GameObjects.Sprite {
	healthBar: Phaser.GameObjects.Graphics;
	healthBox: Phaser.GameObjects.Graphics;
	staminaBar: Phaser.GameObjects.Graphics;
	staminaBox: Phaser.GameObjects.Graphics;
	colorBox: Phaser.GameObjects.Graphics;
	nameText: Phaser.GameObjects.Text;
	hpText: Phaser.GameObjects.Text;
	staminaText: Phaser.GameObjects.Text;
	move: Boolean = false;
	scene: BaseScene;
	tank?: Tank;
	direction: string;
	username: string;
	color: number | null;
	isDead: Boolean = false;
	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		tank: Tank,
		username: string,
		color: number | null,
	) {
		super(scene, x, y, `tank_sprite_${tank.id}`, 0);
		this.tank = tank;
		this.scene = scene;
		this.username = username;
		this.color = color;
		this.direction = 'right';
		this.scene.add.existing(this);
		this.colorBox = this.scene.add.graphics();
		this.healthBar = this.scene.add.graphics();
		this.healthBox = this.scene.add.graphics();
		this.staminaBar = this.scene.add.graphics();
		this.staminaBox = this.scene.add.graphics();
		this.colorBox.setDepth(300);
		this.healthBar.setDepth(300);
		this.healthBox.setDepth(300);
		this.staminaBar.setDepth(300);
		this.staminaBox.setDepth(300);
		// this.setDepth(20);
		this.createAnimations();
		return this;
	}
	death() {
		const fire = this.scene.add.sprite(this.x, this.y, 'fire');
		const smoke = this.scene.add.sprite(this.x, this.y, 'smoke');
		this.scene.soundManager.sounds.expl.play();
		fire.setDepth(400);
		smoke.setDepth(350);
		fire.play('expl');
		smoke.play('smoke');
		this.play(`${this.direction}_${this.tank.id}_dead`);
		this.isDead = true;
	}
	renderUI(params: { stamina: number; hp: number; isActive: boolean }) {
		const { stamina, hp, isActive } = params;
		if (this.nameText) {
			this.nameText.destroy();
		}
		if (this.hpText) {
			this.hpText.destroy();
		}
		if (this.staminaText) {
			this.staminaText.destroy();
		}
		if (this.colorBox) {
			this.colorBox.clear();
		}
		this.healthBar.clear();
		this.healthBox.clear();
		this.staminaBar.clear();
		this.staminaBox.clear();
		this.renderText();
		if (hp <= 0 && !this.isDead) {
			this.death();
			return;
		}
		if (isActive) {
			this.renderStamina(stamina);
		}
		this.renderHealth(hp);
	}
	renderText() {
		this.colorBox.fillStyle(this.color, 0.75);
		this.colorBox.fillCircle(
			this.x - 45,
			this.y + barOffset + barHeight / 2 + 1,
			barHeight / 2 - 2,
		);
		this.nameText = this.scene.add.text(
			this.x - 35,
			this.y + barOffset,
			this.username,
			{ ...textCommonStyle },
		);
		this.nameText.setDepth(350);
	}
	renderHealth(value: number) {
		this.healthBar.fillStyle(0xbe3523, 0.75);
		this.healthBox.fillRect(
			this.x - 50,
			this.y + barOffset + barHeight + 4,
			(value / this.tank.hp) * 100,
			barHeight,
		);
		this.hpText = this.scene.add.text(
			this.x - 50,
			this.y + barOffset + barHeight + 3,
			`${value} / ${this.tank.hp}`,
			{ ...textCommonStyle },
		);
		this.hpText.setDepth(350);
	}
	renderStamina(value: number) {
		this.staminaBar.fillStyle(0x669624, 0.75);
		this.staminaBox.fillRect(
			this.x - 50,
			this.y + barOffset + barHeight * 2 + 4,
			value * 10,
			barHeight,
		);
		this.staminaText = this.scene.add.text(
			this.x - 50,
			this.y + barOffset + barHeight * 2 + 3,
			`${value}`,
			{ ...textCommonStyle },
		);

		this.staminaText.setDepth(350);
	}
	turn(direction: string) {
		this.direction = direction;
		this.play(`${this.direction}_${this.tank.id}`);
	}
	createAnimations() {
		this.createDirectionsSpriteAnimation(
			`tank_sprite_${this.tank.id}`,
			this.tank.id,
		);
		this.createDirectionsSpriteAnimation(
			`tank_sprite_hull_${this.tank.id}`,
			`${this.tank.id}_dead`,
		);
	}
	createDirectionsSpriteAnimation(
		spriteKey: string,
		suffix: number | string,
	) {
		Direction.forEach((direction, index) => {
			// console.log(spriteKey, direction, index);
			this.scene.anims.create({
				key: `${direction}_${suffix}`,
				frameRate: 1,
				frames: this.scene.anims.generateFrameNumbers(spriteKey, {
					start: index,
					end: index,
				}),
				repeat: -1,
			});
		});
	}
}
