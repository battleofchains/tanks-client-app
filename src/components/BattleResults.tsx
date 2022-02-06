import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { PlayersSelectors } from '../models/Players';
import { Player, Tank } from '../models';
import { disableLeaderboard } from '../models/Battle';
import { testPlayers } from '../models/TestPlayersMock';
import {
	UIContainerCentered,
	StyledAppBox,
	StyledAppButtonGreen,
	StyledAppButtonOrange,
} from './StyledUIGridBlocks';
import { styled } from '@mui/material';

const BattleResultsWrapper = styled(UIContainerCentered)({});
const BattleResultsContainer = styled('div')({});

const BattleResultsHeader = styled('div')({
	fontSize: 30,
	color: '#fff',
	fontWeight: 'bold',
	textAlign: 'center',
	textTransform: 'uppercase',
	marginBottom: 30,
});

const BattleResultsHeaderInfo = styled(StyledAppBox)({
	marginBottom: 50,
	display: 'flex',
	fontSize: 20,
	color: '#461414',
	fontWeight: 'bold',
	justifyContent: 'space-between',
});

const BattleResultsTableWrapper = styled(StyledAppBox)({
	marginBottom: 30,
	padding: 2,
});
const BattleResultsTable = styled('table')({
	color: '#461414',
	fontWeight: 'bold',
	borderCollapse: 'collapse',
	fontSize: 20,

	'& > tbody > tr': {
		display: 'block',
		padding: '0 40px',
		borderTop: '4px solid #7c7f88',
	},
	'& > tbody > tr.winner-row': {
		background: '#fcd800',
		borderRadius: 10,
		border: '2px solid #461415',
		backgroundRepeat: 'no-repeat',
		backgroundImage:
			'url(https://static.ubex.com/tanks.app/assets/gui/icon_laurels_left.png), url(https://static.ubex.com/tanks.app/assets/gui/icon_laurels_right.png)',
		backgroundPosition: 'left center, right center',
	},
	'& > tbody > tr.winner-row + tr': {
		borderTop: 'none',
	},
	'& > tbody > tr > td': {
		padding: '5px',
		minWidth: 150,
	},
	'& > tbody > tr > td.avatar': {
		minWidth: 0,
	},
	'& > tbody > tr:first-child > td': {
		border: 'none',
	},
	'& > tbody > tr > td > img': {
		verticalAlign: 'middle',
		marginRight: 10,
	},
	'& .avatar > img': {
		borderRadius: '100%',
		border: '2px solid #461414',
		width: 70,
		height: 70,
	},
});

const BattleResultsFooter = styled('div')({
	display: 'flex',
	justifyContent: 'space-around',
});

const BattleResults = () => {
	const dispatch = useDispatch();
	const { winner, data: playersData } = useSelector(
		(state: RootState) => state.players,
	);
	const { inBattle, inLeaderboard, inLobby } = useSelector(
		(state: RootState) => state.battle,
	);

	const winnerTanks = useSelector(
		(state: RootState) =>
			PlayersSelectors.getWinnerPlayerTanks(state) ||
			testPlayers[0].tanks,
	);
	const handleRepeatBattle = () => {
		dispatch(disableLeaderboard({}));
	};

	const handleEndBattle = () => {
		dispatch(disableLeaderboard({}));
	};
	if (inBattle || inLobby || !inLeaderboard || !playersData) {
		return null;
	}
	return (
		// @ts-ignore
		<BattleResultsWrapper>
			<BattleResultsContainer>
				<BattleResultsHeader>Battle results</BattleResultsHeader>
				<BattleResultsHeaderInfo>
					<div>Battle ID: 32345</div>
					<div>Map: Heavy Rain</div>
					<div>Mode: 2vs2</div>
					<div>Time: 02:34</div>
				</BattleResultsHeaderInfo>
				<BattleResultsTableWrapper>
					<BattleResultsTable>
						<tbody>
							{playersData.map(
								(player: Player, index: number) => {
									return (
										<tr
											className={`${
												index === 0 ? 'winner-row' : ''
											}`}
										>
											<td className="avatar">
												<img src="https://static.ubex.com/tanks.app/assets/gui/card_tank.png" />
											</td>
											<td className="name">
												Player name
											</td>
											<td className="stars">
												<img
													src="https://static.ubex.com/tanks.app/assets/gui/level_tank_star.png"
													alt=""
												/>{' '}
												<span>
													x{' '}
													{Math.pow(
														4 - index,
														4 - index,
													)}
												</span>
											</td>
											<td className="money">
												<img
													src="https://static.ubex.com/tanks.app/assets/gui/icon_money.png"
													alt=""
												/>{' '}
												<span>3500</span>
											</td>
											<td className="damage">
												<img
													src="https://static.ubex.com/tanks.app/assets/gui/icon_harm.png"
													alt=""
												/>{' '}
												<span>350</span>
											</td>
											<td className="frags">
												<img
													src="https://static.ubex.com/tanks.app/assets/gui/icon_frag.png"
													alt=""
												/>{' '}
												<span>3</span>
											</td>
										</tr>
									);
								},
							)}
						</tbody>
					</BattleResultsTable>
				</BattleResultsTableWrapper>
				<BattleResultsFooter>
					<StyledAppButtonOrange onClick={() => handleRepeatBattle()}>
						Play Again
					</StyledAppButtonOrange>
					<StyledAppButtonGreen onClick={() => handleEndBattle()}>
						To home
					</StyledAppButtonGreen>
				</BattleResultsFooter>
			</BattleResultsContainer>
		</BattleResultsWrapper>
	);
};

export default BattleResults;
