/**
 * Created by eugenia on 16.10.16.
 */
import React, {PropTypes} from 'react';
import _ from 'lodash';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import ChipInput from 'material-ui-chip-input';
import {GET_LIST} from 'admin-on-rest';
import sendRequest from '../../../util/rest-client';
import {notify} from '../../../reducers/wrapper/actions';
import {config} from '../../../config';

ChipInput.propTypes = {
  style: PropTypes.object,
  floatingLabelText: PropTypes.node,
  hintText: PropTypes.node,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.object),
  onRequestAdd: PropTypes.func,
  onRequestDelete: PropTypes.func,
  dataSource: PropTypes.arrayOf(PropTypes.object),
  onUpdateInput: PropTypes.func,
  openOnFocus: PropTypes.bool,
  chipRenderer: PropTypes.func
};

class ReferenceManyInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      dataSource: [],
      dataSourceWithIds: []
    };
  }

  static propTypes = {
    addLabel: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    hintProp: PropTypes.string,
    reference: PropTypes.string.isRequired,
    dataSourceConfig: PropTypes.object.isRequired,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    addLabel: true,
    dataSource: [],
    disabled: false
  };

  createChip ({id, text}) {
    return <span id={id}>{text}</span>;
  };

  componentWillMount() {
    const {record, dataSourceConfig, source, hintProp} = this.props;

    if (record[source].length === 0) {
      return;
    }
    const items = record[source];
    const dataSourceWithIds = [];
    const dataSource = _.map(items, (item) => {
      const itemToShow = `${item[dataSourceConfig.text]} ` +
        `${hintProp && item[hintProp] ? '(' + item[hintProp] + ')' : ''}`;
      dataSourceWithIds.push({id: item.id, stringToShow: itemToShow});
      return itemToShow;
    });

    return this.setState({
      dataSource,
      dataSourceWithIds,
      selected: items.map((item) => {
        return this.createChip({id: item[dataSourceConfig.value], text: item[dataSourceConfig.text]})
      })
    });

  }


  handleRequestDelete({props}) {
    const {record, source} = this.props;
    const filteredItems = this.state.selected.filter((item) => {
      return item.props.id !== props.id;
    });

    record[source] = filteredItems.map((item) => {
      return item.props.id;
    });
    return this.setState({selected: filteredItems});
  };

  handleUpdateInput(value) {
    const {hintProp, dataSourceConfig} = this.props;
    return sendRequest(GET_LIST, this.props.reference, {filter: {q: value}, noCount: true})
      .then(({data}) => {
        const dataSourceWithIds = [];
        const dataSource = _.map(data, (item) => {
          const itemToShow = `${item[dataSourceConfig.text]} ` +
            `${hintProp && item[hintProp] ? '(' + item[hintProp] + ')' : ''}`;
          dataSourceWithIds.push({id: item.id, stringToShow: itemToShow});
          return itemToShow;
        });
        return this.setState({
          dataSource,
          dataSourceWithIds
        });
      })
      .catch((err) => {
        console.error(err);
        this.props.dispatch(notify({
            type: config.notificationTypes.error,
            text: 'Failed to request reference field data'
          }
        ));
      });
  };

  handleRequestAdd(item) {
    console.info('Trying hard to add item %s', item);
    if (!item) {
      return;
    }
    const {record, source, input} = this.props;
    const itemInCommonList = _.find(this.state.dataSourceWithIds, {stringToShow: item});

    if (!itemInCommonList) {
      return console.warn('Trying to add something not existing in this world');
    }
    const itemId = itemInCommonList.id;
    const itemInRecord = _.find(record[source], itemId);

    if (!itemInRecord) {
      record[source].push(itemId);
    }

    const existingItems = this.state.selected;
    existingItems.push(this.createChip({
      id: itemId,
      text: itemInCommonList.stringToShow
    }));

    input.onChange(_.map(existingItems, (component) => {
      return component.props.id;
    }));

    return this.setState({
      selected: existingItems
    });
  };

  render() {
    const {label, dataSourceConfig, meta} = this.props;
    return (
      <ChipInput dataSource={this.state.dataSource}
                 onUpdateInput={this.handleUpdateInput.bind(this)}
                 dataSourceConfig={dataSourceConfig}
                 value={this.state.selected}
                 floatingLabelText={label}
                 onRequestAdd={this.handleRequestAdd.bind(this)}
                 onNewRequest={this.handleRequestAdd.bind(this)}
                 onRequestDelete={this.handleRequestDelete.bind(this)}
                 errorText={meta.touched && meta.error}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  const {record = {}, source} = props;
  const value = record[source] ? record[source] : [];
  return {
    record: Object.assign(props.record, {[source]: value})
  };
};

export default connect(mapStateToProps)(withRouter(ReferenceManyInput));