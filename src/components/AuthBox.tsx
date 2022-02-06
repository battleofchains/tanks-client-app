import { Input, Button, styled } from '@mui/material';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserSelectors } from '../models/User';
import {
	StyledAppBox,
	StyledAppButton,
	StyledFormGroup,
} from './StyledUIGridBlocks';

const AuthContainer = styled(StyledAppBox)({
	width: 580,
	maxWidth: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	marginBottom: 15,
});

const AuthHeader = styled('div')({
	fontSize: 30,
	textTransform: 'uppercase',
	textAlign: 'center',
	fontWeight: 'bold',
	color: '#461415',
	marginBottom: 45,
});

const AuthFooter = styled('div')({
	fontSize: 20,
	textTransform: 'uppercase',
	textAlign: 'center',
	fontWeight: 'bold',
	color: '#fff',
});

const AuthButton = styled(StyledAppButton)({
	width: 310,
	maxWidth: '100%',
	marginTop: 10,
	marginBottom: 20,
});

const SocialsContainer = styled('div')({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	'& > a': {
		display: 'block',
		margin: '0 15px',
	},
});

export default () => {
	const dispatch = useDispatch();
	const handleSubmit = (e: Event) => {
		dispatch({
			type: 'api/auth',
			payload: {
				// @ts-ignore
				username: e.target[0].value,
				// @ts-ignore
				password: e.target[1].value,
			},
		});
		e.preventDefault();
		return false;
	};

	const token = useSelector(UserSelectors.getToken);
	if (token) {
		return null;
	}
	return (
		<form onSubmit={handleSubmit.bind(this)} style={{ maxWidth: '100%' }}>
			<AuthHeader>Sign in</AuthHeader>
			<AuthContainer>
				<StyledFormGroup>
					<label htmlFor="username">Email</label>
					<input id="username" name="username" />
				</StyledFormGroup>
				<StyledFormGroup>
					<label htmlFor="password">Password</label>
					<input id="password" name="password" type="password" />
				</StyledFormGroup>
				<AuthButton type="submit">Enter</AuthButton>
				<SocialsContainer>
					<a href="#">
						<img src="https://static.ubex.com/tanks.app/assets/gui/authorization_facebook.png" />
					</a>
					<a href="#">
						<img src="https://static.ubex.com/tanks.app/assets/gui/authorization_google.png" />
					</a>
					<a href="#">
						<img src="https://static.ubex.com/tanks.app/assets/gui/authorization_metamask.png" />
					</a>
				</SocialsContainer>
			</AuthContainer>
			<AuthFooter>
				<a href="#">Sign up</a>
			</AuthFooter>
		</form>
	);
};
