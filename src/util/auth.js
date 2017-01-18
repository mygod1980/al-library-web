/**
 * Created by eugenia on 20.09.16.
 */
import Cookies from 'js-cookie';
import {GET_ONE} from 'admin-on-rest';
import {GET_TOKEN, LOGOUT, config} from '../config';
import sendRequest from './rest-client';

const clientAuth = {
  'client_id': config.auth.clientId,
  'client_secret': config.auth.clientSecret
};
export default {
  checkAuth() {
    const access_token = Cookies.get('access_token');

    if (access_token) {
      return this
        .setupUserModel()
        .then((user) => {
          return user;
        })
        .catch(() => {
          this.resetSession();
          return null;
        });
    } else  {
      return this.renewToken()
        .then(() => {
          return this.setupUserModel();
        })
        .then((user) => {
          return user;
        });
    }
  },

  resetSession() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  },

  renewToken() {
    console.info('Trying to renew access token..');
    const refresh_token = Cookies.get('refresh_token');

    const options = {
      data: Object.assign({'grant_type': 'refresh_token', 'refresh_token': refresh_token}, clientAuth)
    };

    return sendRequest(GET_TOKEN, config.auth.path, options)
      .then(({access_token, refresh_token}) => {
        console.info('Token has been successfully renewed');
        Cookies.set('access_token', access_token, {expires: 1/24});
        Cookies.set('refresh_token', refresh_token, {expires: 30});
      })
      .catch((err) => {
        console.error(err);
        console.info('Failed to renew access token. Redirecting to login..');
        window.location.replace('#/login');
      });
  },

  login(username, password) {
    const options = {
      data: {
        username,
        password,
        'grant_type': 'password'
      }
    };

    options.data = Object.assign(options.data, clientAuth);

    if (Cookies.get('access_token')) {
      return this.checkAuth();
    }

    return sendRequest(GET_TOKEN, config.auth.path, options)
      .then(({access_token, refresh_token}) => {
        Cookies.set('access_token', access_token, {expires: 1/24});
        Cookies.set('refresh_token', refresh_token, {expires: 30});
      });
  },

  logout() {
    return sendRequest(LOGOUT, config.resources.users)
      .then(() => {
        this.resetSession();
        window.location.replace('#/login');
      });
  },

  setupUserModel() {

    return sendRequest(GET_ONE, `${config.resources.users}/me`)
      .then((user) => {
        return user;
      });
  }
};
