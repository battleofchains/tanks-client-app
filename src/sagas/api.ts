import { select, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import apiRequest from '../tools/apiRequest';
import { UserSelectors } from '../models/User';
import { setCookie } from '../tools/cookie';

/*
Тут ссылки на списки объектов, чтобы взять конкретный,
или изменить его, надо добавить к урлу его id,
кроме /api/users/ - там по юзернейму.
В строке Allow видно какие методы доступны.
POST только для отрядов разрешен,
другие только редактировать можно через PUT или PATCH.
Список юзеров сейчас полный показывается,
в остальных фильтр по вызывающему юзеру,
то есть только его танки/отряды/снаряды выводятся.
"users": "http://test.battleofchains.com/api/users/",
"tanks": "http://test.battleofchains.com/api/tanks/",
"squads": "http://test.battleofchains.com/api/squads/",
"projectiles": "http://test.battleofchains.com/api/projectiles/"
 */
export default function* apiSaga(): any {
	yield AuthSaga();
	yield takeLatest('api/token', function* (): any {
		const token = yield select(UserSelectors.getToken);
		yield FetchSaga(token);
		yield fetchCollections();
	});
}

const fetchCollections = function* (): any {
	yield put({ type: 'api/get', payload: { url: 'tanks' } });
	yield put({ type: 'api/get', payload: { url: 'projectiles' } });
};

const AuthSaga = function () {
	return takeLatest('api/auth', function* ({ payload }: any): any {
		try {
			// @ts-ignore
			const { token } = yield call(apiRequest, {
				url: 'auth-token',
				method: 'POST',
				data: payload,
			});
			yield put({ type: 'api/token', payload: token });
			setCookie('token', token);
		} catch (e) {
			yield put({ type: 'api/error', payload: e });
		}
	});
};

const FetchSaga = function (token: string): any {
	return takeEvery('api/get', function* ({ payload }: any): any {
		const { url } = payload;
		console.log(payload);
		try {
			const data = yield call(apiRequest, payload, token);
			yield put({ type: 'api/receive', payload: { url, data } });
		} catch (e) {
			yield put({ type: 'api/error', payload: e });
		}
	});
};
