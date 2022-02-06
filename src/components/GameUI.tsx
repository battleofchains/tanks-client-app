import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserSelectors } from '../models/User';
import {
	UIContainerCentered,
	BgUIContainerCentered,
} from './StyledUIGridBlocks';

// Sub-components
import AuthBox from './AuthBox';
import BeforeBattleTimer from './BeforeBattleTimer';
import BattleSelector from './BattleSelector';
import BattleUI from './BattleUI';
import LobbyUI from './LobbyUI';
import TestBattleUI from './TestBattleUI';
import TankSelector from './TankSelector';
import BattleResults from './BattleResults';
import ActivePlayerTurnMessage from './ActivePlayerTurnMessage';
import PlayerLeftMessage from './PlayerLeftMessage';

const GameUI: FC = ({ children }) => {
	const { inBattle, inLobby, testBattle, battlePlayerNumber } = useSelector(
		(state: RootState) => state.battle,
	);

	const token = useSelector(UserSelectors.getToken);
	return (
		<div
			style={{
				cursor:
					'url("https://static.ubex.com/tanks.app/assets/cursor.png"), auto',
			}}
		>
			{children}
			{!token && (
				<BgUIContainerCentered>
					<AuthBox />
				</BgUIContainerCentered>
			)}
			{!inBattle && !inLobby && token && !testBattle && (
				<BgUIContainerCentered>
					<TankSelector />
					{!battlePlayerNumber && <BattleSelector />}
				</BgUIContainerCentered>
			)}
			<BattleUI />
			<LobbyUI />
			<TestBattleUI />
			<BattleResults />
		</div>
	);
};

export default GameUI;
