/**
 * Created by eugenia on 04.10.16.
 */
import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';

const ArrayInput = ({input, label, source, options, meta: { touched, error }, record = {}}) => {
  const transformToArray = () => {
    // TODO: it's sent to server as string
    record[source] = input.value.trim().split(',');
  };

  return <TextField onBlur={transformToArray}
                    onChange={input.onChange}
                    value={input.value}
                    {...options}
                    type='text'
                    floatingLabelText={label}
                    errorText={touched && error}/>
};

ArrayInput.propTypes = {
  source: PropTypes.string.isRequired,
  record: PropTypes.object,
  includesLabel: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.object,
  type: PropTypes.string,
  validation: PropTypes.object,
};

ArrayInput.defaultProps = {
  includesLabel: true,
  options: {}
};
export default ArrayInput;