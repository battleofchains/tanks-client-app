import { all, takeLatest, select } from 'redux-saga/effects';
import { UserSelectors } from '../models/User';
import wsSaga from './ws';
import apiSaga from './api';

export default function* rootSaga(): any {
	const token = yield select(UserSelectors.getToken);
	if (token) {
		yield wsSaga(token);
	}
	yield takeLatest('api/token', function* ({ payload }: any) {
		yield wsSaga(payload);
	});
	yield all([apiSaga()]);
}
