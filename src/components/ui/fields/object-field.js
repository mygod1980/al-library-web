/**
 * Created by eugenia on 19.01.2017.
 */
import _ from 'lodash';
import React, {PropTypes} from "react";

export default class ObjectField extends React.Component {
  static propTypes = {
    source: PropTypes.string.isRequired
  };

  render () {
    const {record, source} = this.props;
    let string = '';
    const data = record[source];

    _.forOwn(data, (value, key) => {
      return string += `${key} - ${value};`;
    });


    return <span>{string}</span>;
  }
}