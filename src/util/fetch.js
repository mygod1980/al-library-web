/**
 * Created by eugenia on 06.10.16.
 */
import auth from './auth';
import Cookies from 'js-cookie';

export default function fetchData (url, options) {
  const initialRequest = new Request(url, options);
  return fetch(initialRequest)
    .then(response => response.text()
      .then(text => ({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: text,
      })))
    .then(({ status, statusText, headers, body }) => {
      let json;
      try {
        json = JSON.parse(body);
      } catch (e) {
        // not json, no big deal
      }

      if (status < 200 || status === 400 || status > 401) {
        return Promise.reject(new Error((json && (json.error || json.message)) || statusText));
      }

      if (status === 401) {
        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
          return auth.renewToken()
            .then(() => {
              const accessToken = Cookies.get('access_token');
              options.headers.set('Authorization', `Bearer ${accessToken}`);
              let newRequest = new Request(url, options);
              return fetchData(newRequest);
            });
        }


        console.warn('No refresh token found in cookies.. Redirecting to login..');
        return Promise.resolve(window.location.replace('#/login'));
      }

      return { status, headers, body, json };
    });
}
