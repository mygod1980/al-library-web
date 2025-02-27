import React, { PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';

const styles = {
  block: {
    margin: '1rem 0',
    maxWidth: 250,
  },
  label: {
    color: 'rgba(0, 0, 0, 0.298039)',
  },
  toggle: {
    marginBottom: 16,
  },
};

const BooleanInput = ({ input, label }) => (
  <div style={styles.block}>
    <Toggle
      {...input}
      defaultToggled={input.value || false}
      labelStyle={styles.label}
      style={styles.toggle}
      label={label}
    />
  </div>
);

BooleanInput.propTypes = {
  addField: PropTypes.bool.isRequired,
  input: PropTypes.object,
  label: PropTypes.string,
};

BooleanInput.defaultProps = {
  addField: true,
};

export default BooleanInput;