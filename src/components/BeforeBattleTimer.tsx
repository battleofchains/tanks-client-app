import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import FullScreenMessageWrapper from './FullScreenMessageWrapper';

export default () => {
	const { beforeStart } = useSelector((state: RootState) => state.battle);
	if (!beforeStart) {
		return null;
	}
	return (
		<FullScreenMessageWrapper>
			<div>
				<div style={{ fontSize: '0.6em' }}>Ожидание игроков...</div>
				<div>{beforeStart}</div>
			</div>
		</FullScreenMessageWrapper>
	);
};
