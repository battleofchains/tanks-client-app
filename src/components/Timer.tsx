import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material';
import { RootState } from '../store';

const TimerContainer = styled('div')(({ theme }) => ({
	fontWeight: 'bold',
	fontSize: '38px',
	textAlign: 'center',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	backgroundImage:
		'url(https://static.ubex.com/tanks.app/assets/gui/time_frame.png)',
	backgroundRepeat: 'no-repeat',
	backgroundPosition: '0 0',
	backgroundSize: 'cover',
	height: '86px',
	width: '143px',
}));

export default () => {
	const { duration } = useSelector((state: RootState) => state.battle);
	const formatted = moment().startOf('day').seconds(duration).format('mm:ss');
	return <TimerContainer>{formatted}</TimerContainer>;
};
