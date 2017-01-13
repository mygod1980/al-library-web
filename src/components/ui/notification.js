/**
 * Created by eugenia on 24.09.16.
 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import {red400, green400, yellow800} from 'material-ui/styles/colors';
import {config} from '../../config';

class Notification extends React.Component {

  render() {
    const style = {};
    if (this.props.type === config.notificationTypes.error) {
      style.backgroundColor = red400;
    } else if (this.props.type === config.notificationTypes.warning) {
      style.backgroundColor = yellow800;
    } else {
      style.backgroundColor = green400;
    }

    return (<Snackbar
      open={!!this.props.message}
      message={this.props.message}
      autoHideDuration={4000}
      bodyStyle={style}
    />);
  }
}

Notification.propTypes = {
  message: React.PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.string.isRequired]),
  type: PropTypes.string.isRequired
};

Notification.defaultProps = {
  type: 'info'
};

const mapStateToProps = (state) => {
  return {
    message: state.wrapper.notification.text || state.admin.notification.text,
    type: state.wrapper.notification.type || state.admin.notification.type
  }
};

export default connect(mapStateToProps)(Notification);