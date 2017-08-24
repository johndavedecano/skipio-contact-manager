import React from 'react';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from 'routes';
import configureStore from 'state/store';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

if (process.env.NODE_ENV !== 'production') {
	window.store = store;
}

// We need a Root component for React Hot Loading.
function Root() {
	return (
		<Provider store={store}>
			<Router history={history} routes={routes} />
		</Provider>
	);
}

export default Root;
