import React from 'react';
import { Tank } from '../models';

export default ({
	tank,
	hp,
	stamina,
}: {
	tank?: Tank;
	hp?: number;
	stamina?: number;
}) => {
	return (
		<table style={{ fontWeight: 'bold' }}>
			<tbody>
				<tr>
					<td>ID. Тип</td>
					<td>
						{tank.id}.{tank.type.name}
					</td>
				</tr>
				<tr className="color-hp">
					<td>Здоровье:</td>
					{typeof hp !== 'undefined' && <td>{hp || '0'}</td>}
					{!hp && <td>{tank.hp}</td>}
				</tr>
				{stamina >= 0 && (
					<tr className="color-ap">
						<td>ОД:</td>
						<td>{stamina || '0'}</td>
					</tr>
				)}
				<tr className="color-spd">
					<td>Цена хода:</td>
					<td>{tank.moving_price}</td>
				</tr>
				<tr className="color-spd">
					<td>Скорость:</td>
					<td>{Math.round(10 / tank.moving_price)}</td>
				</tr>

				<tr className="color-dmg">
					<td>Крит:</td>
					<td>{tank.critical_chance}%</td>
				</tr>
				<tr className="color-arm">
					<td>Броня:</td>
					<td>{tank.armor}</td>
				</tr>
			</tbody>
		</table>
	);
};
