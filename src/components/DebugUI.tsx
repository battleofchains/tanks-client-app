import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { setStamina, setHp, setPos, setActivePlayer } from '../models/Players';
import { RootState } from '../store';
import { UIRightTop, BlackPaper } from './StyledUIGridBlocks';

const DebugUI = () => {
	const dispatch = useDispatch();
	const { data, activePlayer, activeTank, hp, stamina } = useSelector(
		(state: RootState) => state.players,
	);
	const { selectedTile } = useSelector((state: RootState) => state.battle);

	const [selectedPlayerTanks, setSelectedPlayerTanks] = useState(
		data[0].tanks,
	);
	const handleChangeHP = (increase: boolean) => {
		dispatch(
			setHp({
				username: activePlayer,
				tank: activeTank,
				value: hp[activePlayer][activeTank] + 1 * (increase ? 1 : -1),
			}),
		);
	};
	const handleChangeStamina = (increase: boolean) => {
		dispatch(
			setStamina({
				username: activePlayer,
				tank: activeTank,
				value:
					stamina[activePlayer][activeTank] + 1 * (increase ? 1 : -1),
			}),
		);
	};
	const handleChangePos = (e: any) => {
		e.preventDefault();
		dispatch(
			setPos({
				username: activePlayer,
				tank: activeTank,
				position: {
					x: parseInt(e.currentTarget.x.value),
					y: parseInt(e.currentTarget.y.value),
				},
			}),
		);
	};

	const handleSelectPlayer = (e: SelectChangeEvent) => {
		const player = data.find((p: any) => p.username === e.target.value);
		if (!player) {
			throw Error('Player not found');
		}
		setSelectedPlayerTanks(player.tanks);
		dispatch(
			setActivePlayer({
				username: player.username,
				tank: player.tanks[0].id,
			}),
		);
	};

	const handleSelectTank = (e: SelectChangeEvent) => {
		dispatch(
			setActivePlayer({
				username: activePlayer,
				tank: parseInt(e.target.value),
			}),
		);
	};
	// @ts-ignore
	const ver = APP_VERSION;
	return (
		// @ts-ignore
		<UIRightTop style={{ top: 130 }}>
			<BlackPaper>
				<Box>v.{ver}</Box>
				<Box>
					<Select
						style={{ backgroundColor: '#fff' }}
						value={activePlayer}
						onChange={handleSelectPlayer}
					>
						{data.map((player: any) => (
							<MenuItem
								key={player.username}
								value={player.username}
							>
								{player.username}
							</MenuItem>
						))}
					</Select>
					<Select
						style={{ backgroundColor: '#fff' }}
						value={activeTank.toString()}
						onChange={handleSelectTank}
					>
						{selectedPlayerTanks.map((tank: any) => (
							<MenuItem key={tank.id} value={tank.id}>
								{tank.id}. {tank.type.name}
							</MenuItem>
						))}
					</Select>
				</Box>
				<Box>
					<Typography variant="h5">HP</Typography>
					<Button
						variant="contained"
						onClick={handleChangeHP.bind(this, true)}
					>
						+
					</Button>
					<Button
						variant="contained"
						onClick={handleChangeHP.bind(this, false)}
					>
						-
					</Button>
				</Box>
				<Box>
					<Typography variant="h5">Stamina</Typography>
					<Button
						variant="contained"
						onClick={handleChangeStamina.bind(this, true)}
					>
						+
					</Button>
					<Button
						variant="contained"
						onClick={handleChangeStamina.bind(this, false)}
					>
						-
					</Button>
				</Box>
				<Box>
					{/*<form onSubmit={handleChangePos.bind(this)}>*/}
					{/*	<Typography variant="h5">Position</Typography>*/}
					{/*	<TextField*/}
					{/*		id="pos-x"*/}
					{/*		label="X"*/}
					{/*		name="x"*/}
					{/*		variant="standard"*/}
					{/*		type="number"*/}
					{/*		defaultValue={5}*/}
					{/*		style={{ backgroundColor: '#fff' }}*/}
					{/*	/>*/}
					{/*	<TextField*/}
					{/*		id="pos-y"*/}
					{/*		label="Y"*/}
					{/*		name="y"*/}
					{/*		variant="standard"*/}
					{/*		type="number"*/}
					{/*		defaultValue={5}*/}
					{/*		style={{ backgroundColor: '#fff' }}*/}
					{/*	/>*/}
					{/*	<div>*/}
					{/*		<Button variant="contained" type="submit">*/}
					{/*			OK*/}
					{/*		</Button>*/}
					{/*	</div>*/}
					{/*</form>*/}
					{selectedTile && (
						<div>
							Selected: x: {selectedTile.x}, y:
							{selectedTile.y}
						</div>
					)}
				</Box>
			</BlackPaper>
		</UIRightTop>
	);
};

export default DebugUI;
