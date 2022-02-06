import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import FullScreenMessageWrapper from './FullScreenMessageWrapper';

export default () => {
	const { activePlayer } = useSelector((state: RootState) => state.players);
	const { username } = useSelector((state: RootState) => state.user);
	const [show, toggleShow] = React.useState(false);
	React.useEffect(() => {
		toggleShow(true);
		setTimeout(() => {
			toggleShow(false);
		}, 1500);
	}, [activePlayer]);
	if (!activePlayer || !show) {
		return null;
	}
	return (
		<FullScreenMessageWrapper>
			{activePlayer === username ? (
				<div>
					<div>Ваш ход</div>
				</div>
			) : (
				<div>
					<div style={{ fontSize: '0.6em' }}>Ходит игрок</div>
					<div>{activePlayer}</div>
				</div>
			)}
		</FullScreenMessageWrapper>
	);
};
