import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth from './auth';
import contacts from './contacts';

const rootReducer = combineReducers({
	auth,
	contacts,
	routing: routerReducer
});

export default rootReducer;
