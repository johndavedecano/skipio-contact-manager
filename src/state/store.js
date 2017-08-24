import { createStore, compose, applyMiddleware } from 'redux';
// import { fromJS } from 'immutable';
import thunk from 'redux-thunk';
import rootReducer from './modules/reducer';

// import { createLogger } from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';

import api from './helpers/api';

function getMiddlewares() {
	const thunkMiddleware = thunk.withExtraArgument(api);

	if (process.env.NODE_ENV !== 'prouction') {
		return [thunkMiddleware];
	}

	return [thunkMiddleware];
}

function getComposed() {
	const middlewares = getMiddlewares();
	return compose(autoRehydrate(), applyMiddleware(...middlewares));
}

function configureStore(initialState) {
	const store = createStore(rootReducer, initialState, getComposed());

	persistStore(store, {
		blacklist: ['routing'],
		transforms: [
			immutableTransform({
				blacklist: ['routing']
			})
		]
	});

	return store;
}

export default configureStore;
