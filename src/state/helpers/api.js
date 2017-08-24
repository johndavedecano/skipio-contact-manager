import axios from 'axios';
import get from 'lodash/get';
import store from 'state/store';
import { logout } from 'state/modules/auth';

const TOKEN_PAYLOAD = `Bearer ${localStorage.getItem('token')}`;

axios.defaults.baseURL = 'https://stage.skipio.com/api/v2/';
axios.defaults.headers.common.Authorization = TOKEN_PAYLOAD;

export default axios;
