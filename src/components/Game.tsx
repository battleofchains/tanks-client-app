import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Phaser from 'phaser';
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin.js';
// @ts-ignore
import { IonPhaser, GameInstance } from '@ion-phaser/react';
import { RootState } from '../store';
import { createTestPlayers } from '../models/Players';
import PvPScene from '../scenes/PvPScene';
import BootScene from '../scenes/BootScene';
import TestScene from '../scenes/TestScene';
import { testPlayers } from '../models/TestPlayersMock';

// http://browsergameshub.com/scale-html5-games-on-any-device/
const gameConfig: GameInstance = {
	width: window.innerWidth,
	height: window.innerHeight,
	type: Phaser.AUTO,
	scene: [BootScene, PvPScene],
	backgroundColor: '#664a7a',
	plugins: {
		scene: [
			{
				key: 'rexBoard',
				plugin: BoardPlugin,
				mapping: 'rexBoard',
			},
		],
	},
};

export default function Game() {
	// @ts-ignore
	const gameRef = useRef<HTMLIonPhaserElement>(null);
	const [game, setGame] = useState<GameInstance>();
	const dispatch = useDispatch();
	const { inBattle, testBattle } = useSelector(
		(state: RootState) => state.battle,
	);
	const initialize = inBattle || testBattle;
	/*
	useEffect(() => {
		dispatch(createTestPlayers({
			data: testPlayers,
			activePlayer: 'testUser',
			activeTank: 84,
		}));
	}, []);
	 */
	useEffect(() => {
		if (initialize) {
			if (testBattle) {
				gameConfig.scene = [TestScene];
			}

			const game = Object.assign({}, gameConfig);
			setGame(game);
			// console.log('game.instance', game.instance);
		} else {
			gameRef.current?.destroy();
			setGame(undefined);
		}
	}, [inBattle, testBattle]);

	if (!initialize) {
		return null;
	}
	return (
		<>
			<IonPhaser ref={gameRef} game={game} initialize={initialize} />
		</>
	);
}
