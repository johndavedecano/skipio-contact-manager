import { Map, fromJS } from 'immutable';
import moment from 'moment';
import axios from 'axios';

const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT_URL = '/auth/logout';
const LOGOUT = 'LOGOUT';

const initialState = Map({
	user: Map(),
	error: null,
	isLoading: false,
	isLoaded: false
});

const Logic = {};

export function login(token) {
	return async (dispatch, getState, api) => {
		dispatch({ type: LOGIN });
		try {
			const { data } = await api.get(`users/me?token=${token}`);

			localStorage.setItem('token', token);

			axios.defaults.headers.common.Authorization = `Bearer ${token}`;
			axios.interceptors.response.use(undefined, error => {
				if (error) {
					const ERROR_STATUS_CODE = get(error, 'response.status');
					if (ERROR_STATUS_CODE === 401) {
						store().dispatch(logout());
						window.location.replace(LOGOUT_URL);
					}
				}
			});

			dispatch({ type: LOGIN_SUCCESS, user: fromJS(data.data) });

			return true;
		} catch (error) {
			console.error(error);
			dispatch({
				type: LOGIN_FAILURE,
				error: 'Unable to authenticate'
			});
			return false;
		}
	};
}

export function logout() {
	return dispatch => {
		dispatch({
			type: LOGOUT
		});
		localStorage.removeItem('token');
	};
}

Logic[LOGOUT] = (state, action) => state.set('error', null).set('user', Map());

Logic[LOGIN] = (state, action) =>
	state.set('isLoading', true).set('error', null);

Logic[LOGIN_SUCCESS] = (state, action) => {
	return state
		.set('isLoading', false)
		.set('isLoaded', true)
		.set('user', action.user);
};

Logic[LOGIN_FAILURE] = (state, action) => {
	return state
		.set('isLoading', false)
		.set('error', action.error)
		.set('isLoaded', false);
};

function reducer(state = initialState, action) {
	if (!Logic[action.type]) return state;
	return Logic[action.type](state, action);
}

export default reducer;
