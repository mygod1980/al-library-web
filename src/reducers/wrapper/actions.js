/**
 * Created by eugenia on 23.09.16.
 */
import {LOGIN, LOGOUT, NOTIFY, SHOW_LOADING} from '../../config';

const login = (user) => {
  return {
    type: LOGIN,
    user
  };
};

const logout = () => {
  return {
    type: LOGOUT,
    user: null
  };
};

const setLoadingState = () => {
  return {
    type: SHOW_LOADING
  };
};

const notify = (notification) => {
  return {
    type: NOTIFY,
    notification
  };
};


export {login, logout, setLoadingState, notify};