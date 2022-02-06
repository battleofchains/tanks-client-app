// https://favpng.com/png_view/soldier-of-no-choice-q-version-avatar-blog-u0e01u0e32u0e23u0e4cu0e15u0e39u0e19u0e0du0e35u0e48u0e1bu0e38u0e48u0e19-cartoon-png/hRXbs0Aa
import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import LinearProgress, {
	linearProgressClasses,
} from '@mui/material/LinearProgress';
import { RootState } from '../store';
import { getStringColorFromString } from '../tools/colors';
import { PlayersSelectors } from '../models/Players';
import { Tank } from '../models';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 28,
	width: 128,
	borderRadius: 10,
	border: '2px solid #461415',
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: '#25561f',
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 0,
		backgroundColor: '#43933a',
	},
}));

const ExpProgress = styled(LinearProgress)(({ theme }) => ({
	height: 28,
	borderRadius: 10,
	border: '2px solid #461415',
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: '#bf5106',
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 0,
		backgroundColor: '#f5bc0a',
	},
}));

const ActivePlayerBoxContainer = styled('div')({
	color: '#fff',
	fontWeight: 'bold',
	fontSize: 18,
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

const PlayerTanksList = styled('div')({
	display: 'flex',
	marginTop: 10,
	'& > div': {
		marginRight: 25,
		'&:last-child': {
			marginRight: 0,
		},
	},
});

const PlayerTank = styled('div')({
	position: 'relative',
	'& .tank-img': {
		maxWidth: 100,
	},
});

const PlayerTankLvl = styled('div')({
	background:
		'url(https://static.ubex.com/tanks.app/assets/gui/level_tank_star.png) no-repeat center',
	width: 50,
	height: 48,
	color: '#d61e20',
	position: 'absolute',
	top: '-4px',
	right: '-20px',
	fontWeight: 'bold',
	fontSize: 18,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const StaminaNumber = styled('div')({
	background:
		'url(https://static.ubex.com/tanks.app/assets/gui/user_statusbar_icon.png) no-repeat center',
	color: '#fff',
	position: 'absolute',
	left: -32,
	top: -8,
	width: 43,
	height: 47,
	fontWeight: 'bold',
	fontSize: 18,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

// @ts-ignore
const staticUrl = APP_URL;
const ActivePlayerBox = () => {
	const activeTanks = useSelector(PlayersSelectors.getActivePlayerTanks);
	const { activePlayer, activeTank, stamina, data } = useSelector(
		(state: RootState) => state.players,
	);
	if (!activePlayer) {
		return null;
	}
	console.log('activeTanks', activeTanks);
	return (
		<>
			<ActivePlayerBoxContainer>
				<div>
					Ходит:&nbsp;
					<span
						style={{
							color: getStringColorFromString(activePlayer),
						}}
					>
						{activePlayer}
					</span>
				</div>
				{stamina[activePlayer] &&
					typeof stamina[activePlayer][activeTank] !==
						'undefined' && (
						<div style={{ position: 'relative' }}>
							<BorderLinearProgress
								variant="determinate"
								value={stamina[activePlayer][activeTank] * 10}
							/>
							<StaminaNumber>
								{stamina[activePlayer][activeTank]}
							</StaminaNumber>
						</div>
					)}
			</ActivePlayerBoxContainer>
			<PlayerTanksList>
				{activeTanks.map((tank: Tank) => (
					<PlayerTank>
						<img
							className="tank-img"
							src={`${staticUrl}${tank.image}`}
							alt={tank.name}
						/>
						<PlayerTankLvl>1</PlayerTankLvl>
						<ExpProgress variant="determinate" value={70} />
					</PlayerTank>
				))}
			</PlayerTanksList>
		</>
	);
};
export default ActivePlayerBox;
