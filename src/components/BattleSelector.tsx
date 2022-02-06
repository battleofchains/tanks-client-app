import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectBattleType, setBattleParams } from '../models/Battle';
import { RootState } from '../store';
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Select,
} from '@mui/material';

const defaultBattleType = 'pvp';
const defaultPlayersNumber = 2;
const defaultPlayersTanksNumber = 3;

export default () => {
	const dispatch = useDispatch();
	const { battleTypes, battleType } = useSelector(
		(state: RootState) => state.battle,
	);

	// авто выбор

	React.useEffect(() => {
		dispatch(
			setBattleParams({
				battlePlayerNumber: defaultPlayersNumber,
				battleTankNumber: defaultPlayersTanksNumber,
			}),
		);
		dispatch({
			type: 'socket',
			payload: { battle_type: defaultBattleType },
			meta: { event: 'select_battle' },
		});
	}, []);

	const handleChange = (e: Event) => {
		// @ts-ignore
		const selectedName = e.target.value;
		dispatch(selectBattleType(selectedName));
	};

	const handleConfirm = () => {
		dispatch(
			setBattleParams({
				battlePlayerNumber: battleType.players_number,
				battleTankNumber: battleType.player_tanks_number,
			}),
		);
		dispatch({
			type: 'socket',
			payload: { battle_type: battleType.name },
			meta: { event: 'select_battle' },
		});
	};

	if (!battleTypes.length) {
		return null;
	}

	return (
		<div>
			<InputLabel>Выбери тип битвы:</InputLabel>
			<Select
				size="small"
				// @ts-ignore
				onChange={(e) => handleChange(e)}
				value={battleType ? battleType.name : defaultBattleType}
			>
				{battleTypes.map((b) => (
					<MenuItem value={b.name} key={b.name}>
						{b.name}
					</MenuItem>
				))}
			</Select>
			{battleType && (
				<Button variant="contained" onClick={() => handleConfirm()}>
					Подтвердить
				</Button>
			)}
		</div>
	);
};
