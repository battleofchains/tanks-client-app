import React, { FC } from 'react';
import { styled } from '@mui/styles';

const Wrapper = styled('div')({
	position: 'fixed',
	display: 'flex',
	right: 0,
	left: 0,
	top: 0,
	bottom: 0,
	backgroundColor: 'rgba(0,0,0,0.5)',
	color: 'white',
	alignItems: 'center',
	justifyContent: 'center',
	textAlign: 'center',
	fontSize: 64,
});

const FullScreenMessageWrapper: FC = ({ children }) => {
	if (!children) {
		return null;
	}
	return (
		<Wrapper>
			<div>{children}</div>
		</Wrapper>
	);
};
export default FullScreenMessageWrapper;
