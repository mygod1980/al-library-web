import ReactDOM from "react-dom";
import React from "react";
import {combineReducers, createStore, compose, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import {Router, Route, hashHistory, IndexRoute} from "react-router";
import {syncHistoryWithStore, routerMiddleware, routerReducer} from "react-router-redux";
import createSagaMiddleware from "redux-saga";
import {adminReducer, crudSaga, CrudRoute} from "admin-on-rest";
import {reducer as formReducer} from "redux-form";
import restClient from "./util/rest-client";
import Layout from "./components/ui/layout";
import {UserList, UserCreate, UserEdit} from "./components/admin-resources/users";
import {
  PublicationList,
  PublicationCreate,
  PublicationEdit,
  PublicationShow
} from "./components/admin-resources/publications";
import {AuthorList, AuthorCreate, AuthorEdit, AuthorShow} from "./components/admin-resources/authors";
import {CategoryList, CategoryCreate, CategoryEdit, CategoryShow} from "./components/admin-resources/categories";
import {RequestList, RequestCreate, RequestCreated, RequestShow} from "./components/admin-resources/requests";
import {FileUpload} from './components/admin-resources/file-upload';
import {Delete} from "admin-on-rest/lib/mui";
import auth from "./util/auth";
import Login from "./components/auth/login";
import Logout from "./components/auth/logout";
import wrapperReducer from "./reducers/wrapper/reducer";
import {login, notify} from "./reducers/wrapper/actions";
import {config} from "./config";
import "./css/index.css";

const reducer = combineReducers({
  admin: adminReducer([
    {name: 'users'},
    {name: 'authors'},
    {name: 'categories'},
    {name: 'publications'},
    {name: 'requests'}
  ]),
  form: formReducer,
  routing: routerReducer,
  wrapper: wrapperReducer
});

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, undefined, compose(
  applyMiddleware(routerMiddleware(hashHistory), sagaMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
));

sagaMiddleware.run(crudSaga(restClient));

// initialize the router
const history = syncHistoryWithStore(hashHistory, store);

const checkAuth = (nextState, replace, done) => {

  return auth
    .checkAuth()
    .then((user) => {
      const isLogin = (nextState.location.pathname !== 'login' || nextState.location.pathname !== '/login');
      if (!user && (isLogin || (nextState.location.pathname !== '/'))) {
        return replace('login');
      }
      return store.dispatch(login(user));
    })
    .then(() => {
      return done();
    })
    .catch((err) => {
      done(err);
      return store.dispatch(notify({
        type: config.notificationTypes.error,
        message: err && err.message
      }));
    });
};

const logout = () => {
  return auth.logout();
};

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Layout}>
        <IndexRoute component={PublicationList}/>
        <Route path="publications" component={PublicationList}/>
        <Route path="login" component={Login}/>
        <Route path="logout" component={Logout} onEnter={logout}/>
        <Route path="resources" onEnter={checkAuth}>
          <CrudRoute path="publications"
                     list={PublicationList}
                     create={PublicationCreate}
                     edit={PublicationEdit}
                     show={PublicationShow}
                     remove={Delete}/>
          <CrudRoute path="users"
                     list={UserList}
                     create={UserCreate}
                     edit={UserEdit}
                     remove={Delete}/>
          <CrudRoute path="authors"
                     list={AuthorList}
                     create={AuthorCreate}
                     edit={AuthorEdit}
                     show={AuthorShow}
                     remove={Delete}/>
          <CrudRoute path="categories"
                     list={CategoryList}
                     create={CategoryCreate}
                     edit={CategoryEdit}
                     show={CategoryShow}
                     remove={Delete}/>
          <CrudRoute path="requests"
                     list={RequestList}
                     edit={RequestCreated}
                     create={RequestCreate}
                     show={RequestShow}
                     remove={Delete}/>
          <Route path="publications/:id/upload" component={FileUpload}/>
          <Route path="upload" component={FileUpload}/>
        </Route>
        <CrudRoute path="requests"
                   edit={RequestCreated}
                   create={RequestCreate}
                   show={RequestShow}
                   remove={Delete}/>
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));