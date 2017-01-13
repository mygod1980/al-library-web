/**
 * Created by eugenia on 22.09.16.
 */
import React from 'react';
import {connect} from 'react-redux';
import '../../css/logout.css';
import grey900 from 'material-ui/styles/colors';
import {logout} from '../../reducers/wrapper/actions';

const style = {color: grey900};
class Logout extends React.Component {

  render () {
    this.props.dispatch(logout());
    return (<div className="logout" style={style}>Logging out...</div>);
  }
}

export default connect()(Logout);