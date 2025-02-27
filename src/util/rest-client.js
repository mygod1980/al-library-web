/**
 * Created by eugenia on 20.09.16.
 */
import _ from 'lodash';
import {GET_LIST, GET_MATCHING, GET_ONE, GET_MANY, CREATE, UPDATE, DELETE, fetchUtils} from "admin-on-rest";
import Cookies from "js-cookie";
import {SORT_DESC} from "admin-on-rest/lib/reducer/resource/list/queryReducer";
import {LOGOUT, GET_TOKEN, PUT, config} from "../config";
import fetch from "./fetch";

const apiUrl = `${config.backendUrl}/${config.backendBasePath}`;
const headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};

const prepareQuery = (params) => {
  const filter = Object.assign({}, params.filter || {});
  const query = {};

  if (filter.q) {
    query.q = filter.q;
    delete filter.q;
  }

  query.filter = JSON.stringify(filter);

  return query;
};

const replaceParams = (resource) => {
  if (resource.includes(':id')) {
    let path = location.hash.split('?')[0] || '';
    return path
      .replace('#resources/', '')
      .replace('#/resources/', '');
  }
  return resource;
};
/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The REST request params, depending on the type
 * @returns {Object} REST response
 */
const convertHttpResponseToRest = (response, type, resource, params) => {
  const {json} = response;
  switch (type) {
    case GET_LIST:
      return {
        data: json.map(x => Object.assign({}, x, {id: x['_id']})),
        total: response.total,
      };
    case GET_ONE:
      return Object.assign(json, {id: json['_id']});
    case CREATE:
      return {...json, id: json['_id']};
    default:
      return json;
  }
};

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The REST request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */
const convertRestRequestToHttp = (type, resource, params) => {
  let url = '';
  const {queryParameters} = fetchUtils;
  const options = {};

  const accessToken = Cookies.get('access_token');
  if (accessToken) {
    options.headers = Object.assign({
      'Authorization': `Bearer ${accessToken}`
    }, headers);
  } else {
    options.headers = headers;
  }

  if (params.isForm) {
    delete options.headers['Content-Type'];
  }

  options.headers = new Headers(options.headers);

  switch (type) {
    case GET_LIST: {
      let {page = 0, perPage = 10} = params.pagination || {};
      let {field, order} = params.sort || {};
      if (field === 'id') {
        field = '_id';
      }
      if (order === SORT_DESC) {
        order = -1;
      } else {
        order = 1;
      }

      if (params.filter && params.filter.perPage) {
        perPage = params.filter.perPage;
        delete params.filter.perPage;
      }

      const query = {
        perPage,
        page,
        orderBy: JSON.stringify({[field]: order})
      };

      if (params.filter) {
        if (params.filter.q) {
          query.q = params.filter.q;
          delete params.filter.q;
        }

        const arrayFields = ['authors', 'categories'];
        _.map(arrayFields, (fieldName) => {
          if (params.filter[fieldName]) {
            if (params.filter[fieldName].length > 0) {
              params.filter[fieldName] = {$in: params.filter[fieldName]};
            } else {
              delete params.filter[fieldName];
            }
          }

          return fieldName;
        });
      }

      query.filter = JSON.stringify(params.filter || {});
      url = `${apiUrl}/${resource}?${queryParameters(query)}`;
      break;
    }
    case GET_MATCHING: {
      const query = {
        filter: JSON.stringify(params.filter || {}),
      };
      url = `${apiUrl}/${resource}?${queryParameters(query)}`;
      break;
    }
    case GET_ONE:
      url = `${apiUrl}/${resource}/${params.id || ''}`;
      break;
    case GET_MANY: {
      const query = {
        filter: JSON.stringify({'_id': {$in: [params.id]}}),
      };
      url = `${apiUrl}/${resource}?${queryParameters(query)}`;
      break;
    }
    case UPDATE:
      url = `${apiUrl}/${resource}/${params.id}`;
      options.method = 'PATCH';
      options.body = JSON.stringify(params.data);
      break;

    case PUT:
      url = `${apiUrl}/${resource}`;
      options.method = 'PUT';
      options.body = JSON.stringify(params.data);
      break;

    case CREATE:
      url = `${apiUrl}/${resource}`;
      options.method = 'POST';

      if (resource.includes('requests')) {
        params.data = Object.assign(params.data, {
          client_id: config.auth.clientId,
          client_secret: config.auth.clientSecret
        });
      }

      if (params.isForm) {
        options.body = params.data;
      } else {
        options.body = JSON.stringify(params.data);
      }
      break;
    case DELETE:
      url = `${apiUrl}/${resource}/${params.id}`;
      options.method = 'DELETE';
      break;
    case LOGOUT:
      url = `${apiUrl}/${resource}/logout`;
      options.method = 'POST';
      break;
    case GET_TOKEN:
      url = `${config.backendUrl}/${resource}`;
      options.body = JSON.stringify(params.data);
      options.method = 'POST';
      break;
    default:
      throw new Error(`Unsupported fetch action type ${type}`);
  }
  return {url, options};
};

/**
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} params Request parameters. Depends on the request type
 * @returns {Promise} the Promise for a REST response
 */
const sendRequest = (type, resource, params = {}) => {
  resource = replaceParams(resource);
  params.data = params.data || {};
  const {url, options} = convertRestRequestToHttp(type, resource, params);
  let response = {};
  return fetch(url, options)
    .then((result) => {
      response.json = result.json;
      if (type === GET_LIST) {
        const query = prepareQuery(params);

        const {queryParameters} = fetchUtils;

        return fetch(`${config.backendUrl}/api/${resource}/count?${queryParameters(query)}`, options)
          .then(({json: {count}}) => {
            response.total = count;
            return convertHttpResponseToRest(response, type, resource, params);
          });
      }

      return convertHttpResponseToRest(response, type, resource, params);
    });
};


export default sendRequest;