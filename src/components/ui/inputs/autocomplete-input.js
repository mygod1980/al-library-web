/**
 * Created by eugenia on 16.10.16.
 */
import React, {PropTypes} from 'react';
import _ from 'lodash';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import AutoComplete from 'material-ui/AutoComplete'
import {GET_LIST} from 'admin-on-rest';
import sendRequest from '../../../util/rest-client';
import {config} from '../../../config';
import {notify} from '../../../reducers/wrapper/actions';

class AutoCompleteInput extends React.Component {

  constructor(props) {
    super(props);
    const {record, source} = props;
    this.state = {
      selected: record[source],
      dataSource: [],
      dataSourceWithIds: [],
      errorText: ''
    };
  }

  static propTypes = {
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    dataSourceConfig: PropTypes.object.isRequired,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    includesLabel: true,
    disabled: false
  };

  onNewRequest = (item) => {
    console.info('Trying hard to add item %s', item);
    if (!item) {
      return;
    }
    const {record, source} = this.props;
    const itemInCommonList = _.find(this.state.dataSourceWithIds, {text: item});

    if (!itemInCommonList) {
      return console.warn('Trying to add something not existing in this world');
    }
    const itemId = itemInCommonList.id;

    record[source] = itemId;

    return this.setState({
      selected: {
        id: itemId,
        text: itemInCommonList.text
      }
    });
  };

  onUpdateInput = (value) => {
    const {hintProp, dataSourceConfig, disabled} = this.props;
    if (disabled) {
      return;
    }
    return sendRequest(GET_LIST, this.props.reference, {filter: {q: value}, noCount: true})
      .then(({data}) => {
        const dataSourceWithIds = [];
        const dataSource = _.map(data, (item) => {
          const itemToShow = `${item[dataSourceConfig.text]} ` +
            `${hintProp && item[hintProp] ? '(' + item[hintProp] + ')' : ''}`;
          dataSourceWithIds.push({id: item.id, text: itemToShow});
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

  loadAllData = (reference) => {
    return sendRequest(GET_LIST, reference, {noCount: true});
  };

  componentWillMount() {
    const {record, reference, source, loadAll} = this.props;

    if (!record[source] && !loadAll) {
      return;
    }

    let request;

    if (loadAll) {
      request = this.loadAllData(reference);
    } else {
      request = Promise.resolve([]);
    }

    return request
      .then((result) => {
        let items;
        if (Array.isArray(result)) {
          items = result;
        } else {
          items = result.data;
        }
        const {hintProp, dataSourceConfig} = this.props;
        const dataSourceWithIds = [];
        const dataSource = _.map(items, (item) => {
          const itemToShow = `${item[dataSourceConfig.text]} ` +
            `${hintProp && item[hintProp] ? '(' + item[hintProp] + ')' : ''}`;
          dataSourceWithIds.push({id: item.id, text: itemToShow});
          return itemToShow;
        });

        return this.setState({
          dataSource,
          dataSourceWithIds,
          selected: {
            id: record[source][dataSourceConfig.value],
            text: record[source][dataSourceConfig.text]
          }
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
  }

  render() {
    const {dataSourceConfig, label, input, meta, disabled, loadAll} = this.props;
    return (
      <AutoComplete dataSource={this.state.dataSource}
                    onUpdateInput={this.onUpdateInput}
                    value={this.state.selected.text}
                    searchText={this.state.selected.text}
                    dataSourceConfig={dataSourceConfig}
                    onNewRequest={this.onNewRequest}
                    floatingLabelText={label}
                    errorText={meta.touched && meta.error}
                    filter={(searchText, key) => true}
                    disabled={disabled}
                    openOnFocus={loadAll}
                    menuProps={{
                      onChange: (e) => {
                        input.onChange(_.find(this.state.dataSourceWithIds, {text: e.target.textContent}).id);
                      }
                    }}
      />
    )
  };
}

const mapStateToProps = (state, props) => {
  const {record = {}, source} = props;
  const value = record[source] ? record[source] : '';
  return {
    record: Object.assign(props.record, {[source]: value})
  };
};

export default connect(mapStateToProps)(withRouter(AutoCompleteInput));