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
    const {sourceConfig} = this.props;
    return (<div>
      {
        sourceConfig.map((input) => {
          return (<div key={input.source}>
            <TextField value={this.state[input.source]}
                       floatingLabelText={input.label}
                       onChange={this.onChange(input.source)}
            />
          </div>)
        })
      }
    </div>)
  }
}

export default ObjectInput;