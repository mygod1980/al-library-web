/**
 * Created by eugenia on 14.01.17.
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ActionList from 'material-ui/svg-icons/action/list';

const ListButton = ({basePath = '', label = 'Список', record = {}, ...other}) => {
  let newPath = basePath;
  if (basePath.includes(record.id)) {
    newPath = basePath.replace(`/${record.id}`, '');
  }

  return (<FlatButton
    primary
    label={label}
    icon={<ActionList />}
    containerElement={<Link to={newPath}/>}
    style={{overflow: 'inherit'}}
  />)
};

ListButton.propTypes = {
  basePath: PropTypes.string,
};

export default ListButton;
