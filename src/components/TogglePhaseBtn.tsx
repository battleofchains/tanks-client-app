import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { RootState } from '../store';
import { enableAim, disableAim } from '../models/Battle';

export default () => {
	const dispatch = useDispatch();
	const { aim } = useSelector((state: RootState) => state.battle);
	return (
		<Button
			variant="contained"
			color={'primary'}
			onClick={(e) => {
				e.preventDefault();
				dispatch(aim ? disableAim() : enableAim());
				return false;
			}}
		>
			{aim ? 'Откл' : 'Прицел'}
		</Button>
	);
};
