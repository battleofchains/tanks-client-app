import Button from '@mui/material/Button';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { styled } from '@mui/material';

const TurnBtn = styled('div')({
	background:
		'url(https://static.ubex.com/tanks.app/assets/gui/button_no_step.png) center no-repeat',
	width: 86,
	height: 86,
	marginLeft: 15,
});

export default () => {
	const { activePlayer, activeTank, hp } = useSelector(
		(state: RootState) => state.players,
	);
	const { username } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();
	React.useEffect(() => {
		if (hp[activePlayer] && hp[activePlayer][activeTank] === 0) {
			dispatch({
				type: 'socket',
				payload: {
					username,
				},
				meta: { event: 'turn' },
			});
		}
	}, [activePlayer]);
	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		dispatch({
			type: 'socket',
			payload: {
				username,
			},
			meta: { event: 'turn' },
		});
		return false;
	};

	return (
		<TurnBtn onClick={(e) => handleClick(e)}>
			<img
				src="https://static.ubex.com/tanks.app/assets/gui/no_step.png"
				alt="Next turn"
			/>
		</TurnBtn>
	);
};
