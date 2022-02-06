import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const SoundProvider: FC = ({ children }) => {
	const { beforeStart } = useSelector((state: RootState) => state.battle);
	const { username } = useSelector((state: RootState) => state.user);
	const { hp, activePlayer } = useSelector(
		(state: RootState) => state.players,
	);
	// @ts-ignore
	const path = `${STATIC_URL}/sounds`;
	const sounds = {
		start: new Audio(`${path}/start.ogg`),
		dmg: new Audio(`${path}/shoot.ogg`),
		turn: new Audio(`${path}/turn.ogg`),
	};
	sounds.dmg.volume = 0.2;
	React.useEffect(() => {
		if (activePlayer && activePlayer === username) {
			setTimeout(() => {
				// sounds.turn.play();
			}, 1000);
		}
	}, [activePlayer]);

	React.useEffect(() => {
		if (beforeStart === 4) {
			// sounds.start.play();
		}
	}, [beforeStart]);
	React.useEffect(() => {
		if (hp && activePlayer) {
			// sounds.dmg.play();
		}
	}, [hp]);
	return <>{children}</>;
};

export default SoundProvider;
