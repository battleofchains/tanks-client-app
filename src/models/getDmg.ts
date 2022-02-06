import { Tank } from './index';
import randomMinMax from '../tools/randomMinMax';

export const getDmg = (tank: Tank, targetTank: Tank) => {
	let dmg = randomMinMax(1, 10) + tank.damage_bonus;
	if (Math.random() <= tank.critical_chance / 100) {
		dmg = dmg * 2;
	}
	return dmg;
};
