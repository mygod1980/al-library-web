/**
 * Created by eugenia on 05.12.16.
 */
import React, {PropTypes} from "react";

export default class ReferenceField extends React.Component {
  static propTypes = {
    source: PropTypes.string.isRequired,
    reference: PropTypes.string.isRequired,
    displaySource: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired
  };

  render () {
    const {record, source, displaySource, reference} = this.props;
    let label = '';
    const value = record[source];

    if (Array.isArray(displaySource)) {
      displaySource.map((prop) => {
        label += `${(value && value[prop]) || ''} `;

        return label;
      });
    } else {
      label = (value && value[displaySource]) || '';
    }

    return (<a href={`#/resources/${reference}/${value && value._id}`}>{label.trim()}</a>);
  }
}