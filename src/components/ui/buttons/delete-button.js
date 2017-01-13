import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

const DeleteButton = ({basePath = '', record = {}, label = 'Видалити'}) => <FlatButton
  secondary
  label={label}
  icon={<ActionDelete />}
  containerElement={<Link to={`${basePath}/${encodeURIComponent(record.id)}/delete`}/>}
  style={{overflow: 'inherit'}}
/>;

DeleteButton.propTypes = {
  basePath: PropTypes.string,
  record: PropTypes.object,
};

export default DeleteButton;
