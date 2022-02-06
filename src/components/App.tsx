import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import GameUI from './GameUI';
import theme from '../theme';
import store from '../store';
import Game from './Game';
import SoundProvider from './SoundProvider';
export default function App() {
	return (
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<SoundProvider>
					<GameUI>
						<Game />
					</GameUI>
				</SoundProvider>
			</ThemeProvider>
		</Provider>
	);
}
