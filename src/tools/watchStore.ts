import watch from 'redux-watch';
// @ts-ignore
import isEqual from 'is-equal';

type Store = { getState: () => any; subscribe: (arg0: () => void) => void };
type ObjectPath = string | number | (string | number)[];
type Change = {
	store: Store;
	objectPath: ObjectPath;
	onChange: (
		arg0: any,
		arg1: any,
		arg2: string | number | (string | number)[],
	) => void;
};
type StoreMonitorEntry = {
	objectPath: ObjectPath;
	onChange: Change;
};
// Wrapper de redux-watch
export const watchStore = (
	store: Store,
	storeMonitor: StoreMonitorEntry[] = [],
) => {
	storeMonitor.map((i) => {
		watchChange(store, i.objectPath, i.onChange);
	});
};

// watchChange(store, 'score.value', handleChangeCounter)
const watchChange = (
	store: Store,
	objectPath: ObjectPath,
	onChange: Change,
) => {
	let change = watch(store.getState, objectPath, isEqual);
	store.subscribe(
		change((newVal, oldVal, objectPath) => {
			// @ts-ignore
			onChange(newVal, oldVal, objectPath);
		}),
	);
};
