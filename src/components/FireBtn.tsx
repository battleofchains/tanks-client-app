import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import Button from '@mui/material/Button';
import { PlayersSelectors, setStamina, setHp } from '../models/Players';
import { getDmg } from '../models/getDmg';
import { styled } from '@mui/material';

const FireBtn = styled('div')({
	background:
		'url(https://static.ubex.com/tanks.app/assets/gui/button_fire.png) center no-repeat',
	width: 86,
	height: 86,
});

export default () => {
	const dispatch = useDispatch();
	const { selectedEnemy, hp } = useSelector(
		(state: RootState) => state.players,
	);
	const { testBattle } = useSelector((state: RootState) => state.battle);
	const { username } = useSelector((state: RootState) => state.user);
	const playerTank = useSelector(PlayersSelectors.getActiveTank);
	const targetTank = useSelector(PlayersSelectors.getSelectedTank);
	const playerStamina = useSelector((state: RootState) =>
		playerTank &&
		state.players.stamina[username] &&
		state.players.stamina[username][playerTank.id]
			? state.players.stamina[username][playerTank.id]
			: 0,
	);

	const handleShoot = () => {
		console.log('playerTank', playerTank);
		console.log('targetTank', targetTank);
		if (!playerTank || !targetTank) {
			return;
		}
		const enemyHp = hp[selectedEnemy.username][targetTank.id];
		const dmg = getDmg(playerTank, targetTank);

		if (testBattle) {
			console.log(`${username} hit ${selectedEnemy.username}, ${dmg}`);
			dispatch(
				setStamina({
					username,
					tank: playerTank.id,
					value: playerStamina - 1,
				}),
			);
			dispatch(
				setHp({
					username: selectedEnemy.username,
					tank: selectedEnemy.tank,
					value: enemyHp - dmg,
				}),
			);
		} else {
			dispatch({
				type: 'socket',
				meta: { event: 'shoot' },
				payload: {
					username,
					tank: playerTank.id,
					target: selectedEnemy,
					dmg,
				},
			});
			setTimeout(() => console.log('playerStamina', playerStamina), 1000);
		}
	};
	const isDisabled = !selectedEnemy || playerStamina < 2;
	return (
		<FireBtn
			style={{ opacity: isDisabled ? 0.5 : 1 }}
			onClick={(e) => {
				e.preventDefault();
				if (isDisabled) {
					return;
				}
				handleShoot();
			}}
		>
			<img
				src="https://static.ubex.com/tanks.app/assets/gui/fire.png"
				alt="Fire!"
			/>
		</FireBtn>
	);
};
