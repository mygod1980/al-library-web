/**
 * Created by eugenia on 13.01.17.
 */
import React, {PropTypes} from 'react';
import moment from 'moment';

export default class DateField extends React.Component {
  static propTypes = {
    format: PropTypes.string
  };

  static defaultProps = {
    format: 'MMM Do YYYY, hh:mm:ss a'
  };

  render() {
    const {format, record, source, ...other} = this.props;
    delete other.basePath;
    const date = moment(record[source]);
    const isValid = date.isValid();

    if (isValid) {
      return (<span {...other}>{date.format(format)}</span>);
    } else {
      return <span {...other}>Not set</span>;
    }

  }
}