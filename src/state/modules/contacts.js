import { Map, fromJS } from 'immutable';
import moment from 'moment';
import axios from 'axios';
import { normalize, schema } from 'normalizr';

const initialState = Map({
	meta: Map({
		current_page: 1,
		total_pages: 1,
		total_count: 1,
		next_page: null,
		prev_page: null
	}),
	error: null,
	contacts: Map(),
	isLoading: false,
	isLoaded: false
});

const Logic = {};

const CONTACTS_LOAD = 'CONTACT_LOAD';
const CONTACTS_LOAD_SUCCESS = 'CONTACT_LOAD_SUCCESS';
const CONTACTS_LOAD_FAILURE = 'CONTACT_LOAD_FAILURE';

const CONTACT_SCHEMA = new schema.Entity('contacts');

export function send(contactId, message) {
	return async (dispatch, getState, api) => {
		try {
			const params = {
				recipients: [`contact-${contactId}`],
				message: {
					body: message
				}
			};
			await api.post('/messages', params);
			return {
				success: true,
				message: 'Message was succesfully sent'
			};
		} catch (error) {
			return {
				success: false,
				message: 'Unable to send message. Please try again.'
			};
		}
	};
}

export function load(params = { page: 1, per: 25 }, replace = false) {
	return async (dispatch, getState, api) => {
		dispatch({ type: CONTACTS_LOAD });
		try {
			const response = await api.get('/contacts', { params });
			const { meta, data } = response.data;
			const { entities } = normalize(
				data,
				new schema.Array(CONTACT_SCHEMA)
			);

			console.log(meta, data, entities);

			dispatch({
				type: CONTACTS_LOAD_SUCCESS,
				replace,
				contacts: entities.contacts,
				meta
			});
			return true;
		} catch (error) {
			dispatch({
				type: CONTACTS_LOAD_FAILURE,
				error: 'Unabled to load contacts.'
			});
			return false;
		}
	};
}

Logic[CONTACTS_LOAD] = (state, action) =>
	state.set('isLoading', true).set('error', null);

Logic[CONTACTS_LOAD_SUCCESS] = (state, action) => {
	const prevContacts = action.replace ? Map() : state.get('contacts');
	const nextContacts = fromJS(action.contacts);

	return state
		.set('isLoaded', true)
		.set('meta', fromJS(action.meta))
		.set('contacts', prevContacts.concat(nextContacts));
};

function reducer(state = initialState, action) {
	if (!Logic[action.type]) return state;
	return Logic[action.type](state, action);
}

export default reducer;
