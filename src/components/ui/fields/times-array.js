/**
 * Created by eugenia on 01.11.16.
 */
import React, { PropTypes } from 'react';
import moment from 'moment';

const TimesArrayField = ({ input, label, record, source}) => (
  <div>
    {record.times[0] && moment(record.times[0][source]).format('MM/DD/YYYY hh:mm a')}
  </div>
);

TimesArrayField.propTypes = {
  addLabel: PropTypes.bool.isRequired,
  input: PropTypes.object,
  record: PropTypes.object,
  label: PropTypes.string,
};

TimesArrayField.defaultProps = {
  addLabel: true,
};

export default TimesArrayField;