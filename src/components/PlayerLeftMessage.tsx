import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import FullScreenMessageWrapper from './FullScreenMessageWrapper';

export default () => {
	const { leftPlayers } = useSelector((state: RootState) => state.players);
	const [show, toggleShow] = React.useState(false);
	React.useEffect(() => {
		toggleShow(true);
		setTimeout(() => {
			toggleShow(false);
		}, 1500);
	}, [leftPlayers]);
	if (!leftPlayers.length || !show) {
		return null;
	}
	return (
		<FullScreenMessageWrapper>
			<div style={{ textAlign: 'center' }}>
				<div style={{ fontSize: '0.6em' }}>Игрок покинул бой</div>
				<div>{leftPlayers[leftPlayers.length - 1]}</div>
			</div>
		</FullScreenMessageWrapper>
	);
};
