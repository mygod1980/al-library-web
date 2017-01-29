/**
 * Created by eugenia on 29.01.2017.
 */
import React, {PropTypes} from 'react';

const LocalizedField = ({ source, record = {}, dictionary}) => {
  const value = record[source];
  const localized = dictionary[value];

  return <span>{localized}</span>;
};

LocalizedField.propTypes = {
  source: PropTypes.string.isRequired,
  record: PropTypes.object,
  dictionary: PropTypes.object.isRequired
};

export default LocalizedField;