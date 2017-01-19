import React, {PropTypes} from 'react';
import {TextField} from 'material-ui';

class ObjectInput extends React.Component {

  constructor(props) {
    super(props);
    const state = {};

    this.props.sourceConfig.map((item) => {
      state[item.source] = '';
      return state;
    });

    this.state = state;
  }

  static PropTypes = {
    /* {source: '', label: ''} */
    sourceConfig: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  onChange = (source) => {
    const {input} = this.props;

    return ({target: {value}}) => {
      this.setState({[source]: value});

      return input.onChange(this.state);
    };
  };

  render() {
    const {sourceConfig, label} = this.props;
    return (<div>
      <div>{label}</div>
      {
        sourceConfig.map((input) => {
          return (<div>
            <TextField value={this.state[input.key]}
                       key={input.key}
                       floatingLabelText={input.label}
                       onChange={this.onChange(input.key)}
            />
          </div>)
        })
      }
    </div>)
  }
}

export default ObjectInput;