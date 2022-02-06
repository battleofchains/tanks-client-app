import React, { FC } from 'react';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';

const NotPropagationBox: FC = ({ children, ...props }) => {
	const handleOnMouseDown = (e: any) => {
		e.stopPropagation();
	};
	return (
		<Box onMouseDown={handleOnMouseDown.bind(this)} {...props}>
			{children}
		</Box>
	);
};
export const UIContainer = styled(Box)({
	position: 'absolute',
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
});

export const UIContainerCentered = styled(Box)({
	position: 'absolute',
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover',
});

export const BgUIContainerCentered = styled(UIContainerCentered)({
	backgroundImage:
		'url(https://static.ubex.com/tanks.app/assets/gui/background.png)',
});
export const UILeftTop = styled(NotPropagationBox)({
	position: 'absolute',
	top: 26,
	left: 23,
});

export const UIRightTop = styled(NotPropagationBox)({
	position: 'absolute',
	top: 26,
	right: 23,
	display: 'flex',
});

export const UIRightBottom = styled(NotPropagationBox)({
	position: 'absolute',
	bottom: 26,
	right: 23,
	display: 'flex',
});

export const UILeftBottom = styled(NotPropagationBox)({
	position: 'absolute',
	bottom: 26,
	left: 23,
});

export const UICenterBottom = styled(NotPropagationBox)({
	position: 'absolute',
	bottom: 26,
	left: 0,
	right: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

export const BlackPaper = styled('div')({
	backgroundColor: 'rgba(0,0,0,0.3)',
	borderRadius: 10,
	color: '#fff',
	padding: 15,
});

export const StyledAppBox = styled('div')({
	boxSizing: 'border-box',
	backgroundColor: '#adb2be',
	border: '2px solid #461415',
	padding: '25px  20px',
	borderRadius: 10,
});

export const StyledAppButton = styled('button')({
	backgroundColor: '#f6bc08',
	color: '#fff',
	textTransform: 'uppercase',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	padding: 10,
	borderRadius: 10,
	fontSize: 30,
	fontWeight: 'bold',
	border: '2px solid #461415',
});

export const StyledAppButtonYellow = styled(StyledAppButton)({
	color: '#461414',
	backgroundColor: 'rgb(191,81,5)',
	background:
		'linear-gradient(0deg, rgba(191,81,5,1) 6%, rgba(250,159,8,1) 8%, rgba(246,188,8,1) 8%, rgba(246,188,8,1) 89%, rgba(253,212,59,1) 90%)',
});

export const StyledAppButtonGreen = styled(StyledAppButton)({
	backgroundColor: 'rgb(3,65,0)',
	background:
		'linear-gradient(0deg, rgba(3,65,0,1) 10%, rgba(1,124,8,1) 10%, rgba(0,138,26,1) 95%, rgba(80,180,48,1) 95%)',
});

export const StyledAppButtonOrange = styled(StyledAppButton)({
	backgroundColor: 'rgb(134,35,3)',
	background:
		'linear-gradient(0deg, rgba(134,35,3,1) 10%, rgba(188,71,2,1) 10%, rgba(209,84,0,1) 95%, rgba(215,120,36,1) 95%)',
});

export const StyledAppButtonGray = styled('a')({
	width: 86,
	height: 86,
	display: 'block',
	position: 'relative',
	marginLeft: 15,
	background:
		'url(https://static.ubex.com/tanks.app/assets/gui/button.png) center no-repeat',
	'&:first-child': {
		marginLeft: 0,
	},
});

export const StyledFormGroup = styled('div')({
	marginBottom: 20,
	width: '100%',
	'& > label': {
		color: '#461415',
		display: 'block',
		fontWeight: 'bold',
		marginBottom: 10,
		fontSize: 18,
	},
	'& > input': {
		boxSizing: 'border-box',
		width: '100%',
		border: '2px solid #461415',
		borderRadius: 10,
		display: 'block',
		padding: 15,
		fontSize: 18,
	},
});
