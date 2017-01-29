/**
 * Created by eugenia on 20.09.16.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import People from 'material-ui/svg-icons/social/people';
import Person from 'material-ui/svg-icons/social/person';
import CloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import Label from 'material-ui/svg-icons/action/label';
import Bookmark from 'material-ui/svg-icons/action/bookmark';
import Add from 'material-ui/svg-icons/content/add';
import VerifiedUser from 'material-ui/svg-icons/action/verified-user';
import FolderOpen from 'material-ui/svg-icons/file/folder-open';
import UserDropDown from './header/user-dropdown';
import Menu from 'admin-on-rest/lib/mui/layout/Menu';
import {lightBlue50} from 'material-ui/styles/colors';
import Notification from '../../components/ui/notification';
import {config} from '../../config';
import theme from './theme/dark-theme';

class Layout extends React.Component {
  render() {
    const isLogin = this.props.location.pathname === '/login' || this.props.location.pathname === '/';
    const dropDown = isLogin || !this.props.user ? <span/> : <UserDropDown router={this.props.router}/>;
    const title = this.props.children.props.route.title;
    const rightElement = this.props.isLoading ? <CircularProgress color={lightBlue50} size={0.7}/> : dropDown;
    let resources = [];

    if (this.props.user) {
      resources = [
        {name: 'resources/publications', icon: FolderOpen, options: {label: 'Книги'}, list: true},
        {name: 'resources/authors', icon: Person, options: {label: 'Автори'}, list: true},
        {name: 'resources/categories', icon: Label, options: {label: 'Категорії'}, list: true}
      ];
    } else {
      resources = [
        {name: 'publications', icon: FolderOpen, options: {label: 'Книги'}, list: true},
        {name: 'login', icon: VerifiedUser, options: {label: 'Авторизуватись'}, list: true},
        {
          name: `requests/create?type=${encodeURIComponent(config.request.types.REGISTRATION)}`,
          icon: Add,
          options: {label: 'Зареєструватись'},
          list: true
        }
      ]
    }

    if (this.props.isAdmin) {
      resources.push({name: 'resources/users', icon: People, options: {label: 'Користувачі'}, list: true});
      resources.push({name: 'resources/requests', icon: Bookmark, options: {label: 'Запити'}, list: true});
      resources.push({name: 'resources/upload', icon: CloudUpload, options: {label: 'Додати файл книги'}, list: true});
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <div className="container" id="app-wrapper">
          <div>
            <AppBar title={title || 'Електронна бібліотека'}
                    iconElementRight={rightElement}
                    showMenuIconButton={false}
                    className="app-bar"/>
            <div className={isLogin ? "login" : "body"}
                 style={isLogin ? {} : {display: 'flex', flex: '1', backgroundColor: '#edecec'}}>
              <div style={{flex: 1}}>{this.props.children}</div>
              {isLogin ? null : <Menu resources={resources}/>}
            </div>

          </div>
          <Notification/>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.wrapper.user,
    isLoading: state.admin.loading > 0 || state.wrapper.isLoading,
    isAdmin: state.wrapper.user && state.wrapper.user.role === config.roles.ADMIN
  };
};

Layout.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.node,
  route: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps
)(withRouter(Layout));

