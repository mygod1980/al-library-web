/**
 * Created by eugenia on 23.09.16.
 */
import {LOGIN, LOGOUT, SHOW_LOADING, NOTIFY} from '../../config';

let initialState = {
  isLoading: false,
  isLoggedIn: false,
  user: null,
  notification: {
    text: '' // message on SnackBar is required, let's keep empty string to avoid warnings
  }
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {...state, user: action.user, isLoggedIn: true, isLoading: false};
    case LOGOUT:
      return initialState;
    case SHOW_LOADING:
      return {...initialState, isLoading: true};
    case NOTIFY:
      return {...state, notification: action.notification, isLoading: false};
    default:
      return state;
  }
};

export default loginReducer;

