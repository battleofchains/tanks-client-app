import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import BattleSlice from './models/Battle';
import ChatSlice from './models/Chat';
import UserSlice from './models/User';
import PlayersSlice from './models/Players';
import ApiSlice from './models/Api';
import appSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
	reducer: {
		battle: BattleSlice,
		chat: ChatSlice,
		user: UserSlice,
		players: PlayersSlice,
		api: ApiSlice,
	},
	middleware: [sagaMiddleware],
});
sagaMiddleware.run(appSaga);

export type RootState = ReturnType<typeof store.getState>;
export default store;
