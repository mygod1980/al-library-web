/**
 * Created by eugenia on 11.10.16.
 */
import React, {PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

class ActionButton extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      open: false
    };
  }

  onClose = () => {
    return this.setState({open: false});
  };

  onOpen = () => {
    return this.setState({open: true});
  };

  confirmAndClose = () => {
    this.setState({open: false});
    return this.props.onConfirm();
  };

  render() {
    const {formatMessage} = this.props.intl;
    const defaultProps = {
      title: formatMessage({id: 'title.confirmation'}),
      message: formatMessage({id: 'message.confirmation.default'})
    };
    const actions = [
      <FlatButton
        label={formatMessage({id: 'label.cancel'})}
        primary={true}
        onTouchTap={this.onClose}
      />,
      <FlatButton
        label={formatMessage({id: 'label.submit'})}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.confirmAndClose}
      />
    ];

    return (
      <div>
        <FlatButton label={this.props.actionName}
                    icon={this.props.icon}
                    onTouchTap={this.onOpen}
                    className="action-button"/>
        <Dialog
          title={this.props.title || defaultProps.title}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.onClose}
        >
          {this.props.message || defaultProps.message}
        </Dialog>
      </div>
    );
  }

  static propTypes = {
    message: React.PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.string.isRequired]),
    actionName: React.PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.string.isRequired]),
    title: React.PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.string.isRequired]),
    onConfirm: PropTypes.func.isRequired,
    icon: PropTypes.node.isRequired,
    intl: intlShape.isRequired
  };
}

export default injectIntl(ActionButton);