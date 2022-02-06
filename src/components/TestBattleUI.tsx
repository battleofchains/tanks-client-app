import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import { RootState } from '../store';
import { startTestBattle, stopTestBattle } from '../models/Battle';
import { createTestPlayers, clearTestPlayers } from '../models/Players';
import { setUsername } from '../models/User';
import DebugUI from './DebugUI';
import { testPlayers } from '../models/TestPlayersMock';
import { Tank } from '../models';
export default () => {
	const dispatch = useDispatch();
	const { testBattle, inBattle } = useSelector(
		(state: RootState) => state.battle,
	);
	if (inBattle) {
		return null;
	}
	const handleToggleBattle = () => {
		if (testBattle) {
			dispatch(clearTestPlayers({}));
			dispatch(setUsername(null));
			dispatch(stopTestBattle({}));
		} else {
			dispatch(
				createTestPlayers({
					data: testPlayers,
					activePlayer: 'testUser',
					activeTank: 84,
				}),
			);
			dispatch(setUsername('testUser'));
			dispatch(startTestBattle({}));
		}
	};

	const createParamData = (param: 'hp' | 'stamina', playersData: any) => {
		const res: any = {};
		playersData.forEach(({ username, tanks }: any) => {
			if (!res[username]) {
				res[username] = {};
			}
			tanks.forEach((tank: Tank) => {
				{
					res[username][tank.id] = param === 'hp' ? tank.hp : 10;
				}
			});
		});
		return res;
	};

	return (
		<>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: '50%',
					marginLeft: '-67px',
				}}
			>
				<Button
					variant="contained"
					color="secondary"
					onClick={handleToggleBattle.bind(this)}
				>
					{testBattle ? 'Stop test battle' : 'Start test battle'}
				</Button>
			</div>
			{testBattle && <DebugUI />}
		</>
	);
};
