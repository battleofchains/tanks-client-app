import { StyledAppButtonGray } from './StyledUIGridBlocks';
import React from 'react';

const GameMenu = () => {
	return (
		<div style={{ display: 'flex' }}>
			<StyledAppButtonGray
				style={{
					backgroundImage:
						'url(https://static.ubex.com/tanks.app/assets/gui/button_home.png)',
				}}
			/>
			<StyledAppButtonGray
				style={{
					backgroundImage:
						'url(https://static.ubex.com/tanks.app/assets/gui/button_shop.png)',
				}}
			/>
			<StyledAppButtonGray
				style={{
					backgroundImage:
						'url(https://static.ubex.com/tanks.app/assets/gui/button_warehouse.png)',
				}}
			/>
			<StyledAppButtonGray
				style={{
					backgroundImage:
						'url(https://static.ubex.com/tanks.app/assets/gui/button_friends.png)',
				}}
			/>
		</div>
	);
};

export default GameMenu;
