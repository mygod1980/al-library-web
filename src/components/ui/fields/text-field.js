/**
 * Created by eugenia on 06.12.16.
 */
import React, {PropTypes} from "react";

const CustomTextField = ({ source, record = {}, style, value }) => <span style={style}>{source ? record[source] : value}</span>;

CustomTextField.propTypes = {
  record: PropTypes.object,
  source: PropTypes.string,
  value: PropTypes.any,
  style: PropTypes.object,
};

export default CustomTextField;