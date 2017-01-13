/**
 * Created by eugenia on 28.10.16.
 */
import React, {PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';

export default class LinkButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    buttonLabel: PropTypes.string.isRequired
  };

  handleClick = () => {
    return this.props.onClick(this.props.record);
  };

  render() {
    return (
      <FlatButton label={this.props.buttonLabel}
                  onTouchTap={this.handleClick}/>
    );
  }
}