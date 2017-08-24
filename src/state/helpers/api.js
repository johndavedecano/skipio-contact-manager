import axios from 'axios';
import get from 'lodash/get';
import store from 'state/store';
import { logout } from 'state/modules/auth';

const TOKEN_PAYLOAD = `Bearer ${localStorage.getItem('token')}`;

axios.defaults.baseURL = 'https://stage.skipio.com/api/v2/';

if (localStorage.getItem('token')) {
	axios.defaults.headers.common.Authorization = TOKEN_PAYLOAD;
	axios.defaults.params = { token: localStorage.getItem('token') };
	axios.interceptors.response.use(undefined, error => {
		if (error) {
			const ERROR_STATUS_CODE = get(error, 'response.status');
			if (ERROR_STATUS_CODE === 401) {
				store().dispatch(logout());
				window.location.replace('/login');
			}
		}
	});
}

export default axios;
