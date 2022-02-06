import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
	UICenterBottom,
	UILeftBottom,
	UILeftTop,
	UIRightBottom,
	UIRightTop,
} from './StyledUIGridBlocks';
import ActivePlayerBox from './ActivePlayerBox';
import Timer from './Timer';
import NextTurnBt from './NextTurnBt';
import TogglePhaseBtn from './TogglePhaseBtn';
import FireBtn from './FireBtn';
import Chat from './Chat';
import DropMenu from './DropMenu';
import Options from './Options';
import { BtnsData, Entries as MockEntries } from '../models/mockBonuses';
import BeforeBattleTimer from './BeforeBattleTimer';
import ActivePlayerTurnMessage from './ActivePlayerTurnMessage';
import PlayerLeftMessage from './PlayerLeftMessage';

export default () => {
	const { username } = useSelector((state: RootState) => state.user);
	const { activePlayer } = useSelector((state: RootState) => state.players);
	const { inBattle, testBattle, turn } = useSelector(
		(state: RootState) => state.battle,
	);
	if (!inBattle && !testBattle) {
		return null;
	}
	return (
		<>
			<BeforeBattleTimer />
			<ActivePlayerTurnMessage />
			<PlayerLeftMessage />
			<UILeftTop>
				{/*<div>Ход: #{turn}</div>*/}
				<ActivePlayerBox />
			</UILeftTop>
			<UIRightTop>
				<Timer />
				<Options />
			</UIRightTop>
			<UICenterBottom>
				<FireBtn />
				<NextTurnBt />
			</UICenterBottom>
			<UILeftBottom>
				<Chat height={80} />
			</UILeftBottom>
			{activePlayer === username && (
				<UIRightBottom>
					<DropMenu
						btnData={BtnsData['equipment']}
						entries={MockEntries['equipment']}
					/>
					<DropMenu
						btnData={BtnsData['ammunition']}
						entries={MockEntries['ammunition']}
					/>
					<DropMenu
						btnData={BtnsData['emergency']}
						entries={MockEntries['emergency']}
					/>
					{/*<TogglePhaseBtn />*/}
				</UIRightBottom>
			)}
		</>
	);
};
