/**
 * Created by eugenia on 04.10.16.
 */
import React, {PropTypes} from 'react';

const ArrayTextField = ({ source, record = {}, dictionary}) => {
  let itemsToShow = '';
  if (dictionary) {
    (record[source] || []).map((item) => {
      const itemValue = dictionary[item].toLowerCase();
      return itemsToShow += itemsToShow.length ?  `, ${itemValue}` : itemValue;
    });
  } else {
    itemsToShow = (record[source] || []).join(', ');
  }

  return (<span>{itemsToShow}</span>);
};

ArrayTextField.propTypes = {
  source: PropTypes.string.isRequired,
  record: PropTypes.object,
  dictionary: PropTypes.object
};

export default ArrayTextField;