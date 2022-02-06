import React from 'react';
import { styled } from '@mui/material';

const OptionsBtn = styled('div')({
	position: 'relative',
	marginLeft: 15,
	width: 86,
	height: 86,
	background:
		'url(https://static.ubex.com/tanks.app/assets/gui/button.png) center no-repeat',
});

const Options = () => {
	return (
		<OptionsBtn>
			<img
				src="https://static.ubex.com/tanks.app/assets/gui/button_settings.png"
				alt="Options"
			/>
		</OptionsBtn>
	);
};

export default Options;
