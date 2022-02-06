import React from 'react';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { UIContainerCentered } from './StyledUIGridBlocks';
import { RootState } from '../store';
import PlayersList from './PlayersList';
import Chat from './Chat';

export default () => {
	const { inLobby } = useSelector((state: RootState) => state.battle);
	if (!inLobby) {
		return null;
	}

	return (
		<UIContainerCentered>
			<div>
				<Typography variant="h4">
					Идет поиск игроков...{' '}
					<CircularProgress size={20} color={'inherit'} />
				</Typography>
				<Grid container spacing={2}>
					<Grid item>
						<Chat />
					</Grid>
					<Grid item>
						<PlayersList />
					</Grid>
				</Grid>
			</div>
		</UIContainerCentered>
	);
};
