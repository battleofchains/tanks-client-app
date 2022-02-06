import { call, put, select, take, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Socket } from 'socket.io';
import io from 'socket.io-client';
import { UserSelectors } from '../models/User';
import { RootState } from '../store';
const host = 'test.battleofchains.com';
const port = process.env.NODE_ENV === 'development' ? '80' : '443';

const protocol = process.env.NODE_ENV === 'development' ? 'ws' : 'wss';
function createSocket(token: string) {
	return io(`${protocol}://${host}:${port}`, {
		transports: ['websocket'],
		query: {
			token,
		},
	});
}

function createSocketChannel(socket: Socket) {
	// `eventChannel` takes a subscriber function
	// the subscriber function takes an `emit` argument to put messages onto the channel
	return eventChannel((emit) => {
		const handler = (eventName: string, payload: any) => {
			// puts event payload into the channel
			// this allows a Saga to take this payload from the returned channel
			emit({ type: eventName, payload });
		};

		const errorHandler = (errorEvent: any) => {
			// create an Error object and put it into the channel
			emit(new Error(errorEvent.reason));
		};

		// setup the subscription
		socket.onAny(handler);
		socket.on('error', errorHandler);

		// the subscriber must return an unsubscribe function
		// this will be invoked when the saga calls `channel.close` method
		const unsubscribe = () => {
			socket.offAny(handler);
		};

		return unsubscribe;
	});
}

function* checkLose(): any {
	const isLose = yield select((state: RootState) => {
		const { username } = state.user;
		const { hp } = state.players;
		if (!hp[username]) {
			return false;
		}
		const dead = Object.keys(hp[username]).filter(
			(tankId) => hp[username][tankId] <= 0,
		);
		return dead.length >= Object.keys(hp[username]).length;
	});
	if (isLose) {
		yield put({ type: 'socket/lose' });
	}
}
export default function* wsSaga(token: string): any {
	const socket = yield call(createSocket, token);
	// @ts-ignore
	const socketChannel = yield call(createSocketChannel, socket);
	// @ts-ignore
	yield takeEvery('socket', function* ({ payload, meta }) {
		socket.emit(meta.event, payload);
	});
	while (true) {
		yield checkLose();
		try {
			// An error from socketChannel will cause the saga jump to the catch block
			const { type, payload } = yield take(socketChannel);
			if (type !== 'make_move') {
				console.log(type, payload);
			}

			yield put({ type: `socket/${type}`, payload });
		} catch (err) {
			console.error('socket error:', err);
			// socketChannel is still open in catch block
			// if we want end the socketChannel, we need close it explicitly
			// socketChannel.close()
		}
	}
}
