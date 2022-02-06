import React from 'react';
import { useSelector } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import { RootState } from '../store';

export default function PlayersList() {
	const users = useSelector((state: RootState) => state.players.data);
	if (!users) {
		return null;
	}
	return (
		<>
			<InputLabel>Игроки:</InputLabel>
			{users.map((user: any, i: number) => (
				<div key={user.username + i}>
					<div>{user.username}</div>
				</div>
			))}
		</>
	);
}
