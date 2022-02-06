import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Player, Tank } from '../models';
import { PlayersSelectors } from '../models/Players';
import TankParamsCard from './TankParamsCard';

export default () => {
	const { username } = useSelector((state: RootState) => state.user);
	const { hp, stamina, activePlayer, activeTank } = useSelector(
		(state: RootState) => state.players,
	);
	const activePlayerTanks = useSelector(
		PlayersSelectors.getActivePlayerTanks,
	);

	if (!activePlayer) {
		return null;
	}
	const activePlayerHpTanks = hp[activePlayer];
	const activePlayerStaminaTanks = stamina[activePlayer];

	return (
		<div>
			{activePlayerTanks.map((tank: Tank) => {
				const hpValue =
					activePlayerHpTanks && activePlayerHpTanks[tank.id]
						? activePlayerHpTanks[tank.id]
						: null;
				const staminaValue =
					activePlayerStaminaTanks &&
					activePlayerStaminaTanks[tank.id]
						? activePlayerStaminaTanks[tank.id]
						: null;
				return (
					<div
						key={`${tank.id}`}
						style={{
							outline:
								activeTank === tank.id ? '2px solid white' : '',
						}}
					>
						<TankParamsCard
							tank={tank}
							hp={hpValue}
							stamina={staminaValue}
						/>
						<hr />
					</div>
				);
			})}
		</div>
	);
};
