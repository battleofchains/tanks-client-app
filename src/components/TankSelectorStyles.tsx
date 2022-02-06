import { styled } from '@mui/material';
import {
	BlackPaper,
	StyledAppBox,
	StyledAppButton,
} from './StyledUIGridBlocks';

export const TankSelectorWrapper = styled('div')({
	display: 'flex',
	width: '100%',
	height: '100%',
	justifyContent: 'space-between',
	flexDirection: 'column',
});
export const TankSelectorHeader = styled('div')({
	display: 'flex',
	justifyContent: 'space-between',
	margin: 25,
	marginBottom: 0,
});

export const GameModeWrapper = styled(BlackPaper)({
	fontWeight: 'bold',
	fontSize: 32,
	textTransform: 'uppercase',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: 86,
	boxSizing: 'border-box',
});
export const MoneyButton = styled(StyledAppButton)({
	color: '#fff',
	padding: '0 10px',
	height: 86,
	whiteSpace: 'nowrap',
});
export const TankSelectorFooter = styled('div')({
	display: 'flex',
	margin: 25,
	marginBottom: 55,
	justifyContent: 'center',
	alignItems: 'center',
});
export const ToBattleButton = styled(StyledAppButton)({
	backgroundColor: '#ff6801',
	color: '#fff',
	fontSize: 28,
	padding: '30px 40px',
	marginLeft: 'auto',
});
export const TanksScrollerWrapper = styled('div')({
	position: 'absolute',
	left: '50%',
	transform: 'translateX(-50%)',
});
export const TanksScroller = styled(StyledAppBox)({
	display: 'flex',
	margin: '0 15px',
	padding: 10,
});
export const ScrollerArrows = styled('div')({
	position: 'absolute',
	width: 25,
	height: 40,
	top: '50%',
	marginTop: -20,
});
export const ScrollerArrowLeft = styled(ScrollerArrows)({
	left: -20,
	backgroundImage:
		'url(https://static.ubex.com/tanks.app/assets/gui/down_panel_scroll_left.png)',
});
export const ScrollerArrowRight = styled(ScrollerArrows)({
	right: -20,
	backgroundImage:
		'url(https://static.ubex.com/tanks.app/assets/gui/down_panel_scroll_right.png)',
});
export const TanksScrollerEntry = styled('div')({
	width: 86,
	height: 86,
	border: '2px solid #461415',
	borderRadius: 10,
	backgroundSize: 'cover',
	backgroundPosition: 'center',
	marginLeft: 10,
	'&:first-child': {
		marginLeft: 0,
	},
});
