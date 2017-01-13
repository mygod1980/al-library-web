/**
 * Created by eugenia on 20.09.16.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import People from 'material-ui/svg-icons/social/people';
import UserDropDown from './header/user-dropdown';
import Menu from 'admin-on-rest/lib/mui/layout/Menu';
import {lightBlue50} from 'material-ui/styles/colors';
import Notification from '../../components/ui/notification';

class Layout extends React.Component {
  render() {
    const isLogin = this.props.location.pathname === '/login' || this.props.location.pathname === '/';
    const dropDown = isLogin ? <span/> : <UserDropDown router={this.props.router}/>;
    const title = this.props.children.props.route.title;
    const rightElement = this.props.isLoading ? <CircularProgress color={lightBlue50} size={0.7}/> : dropDown;
    const resources = [
      {name: 'resources/users', icon: People,  options: {label: 'Коритувачі'}}
    ];
    return (
      <MuiThemeProvider>
        <div className="container" id="app-wrapper">
          <div>
            <AppBar title={title || 'Електронна бібліотека'}
                    iconElementRight={rightElement}
                    showMenuIconButton={false}
                    className="app-bar"/>
            <div className={isLogin ? "login" : "body"}
                 style={isLogin ? {} :{ display: 'flex', flex: '1', backgroundColor: '#edecec' }}>
              <div style={{ flex: 1 }}>{this.props.children}</div>
              {isLogin ? null : <Menu resources={resources} />}
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
    isLoading: state.admin.loading > 0 || state.wrapper.isLoading
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

