import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

const DeleteButton = ({basePath = '', record = {}, label = 'Видалити'}) => {
  const includesId = basePath.includes(record.id);
  const link = includesId ? `${basePath}/delete` : `${basePath}/${encodeURIComponent(record.id)}/delete`;

  return (<FlatButton
    secondary
    label={label}
    icon={<ActionDelete />}
    containerElement={<Link to={link}/>}
    style={{overflow: 'inherit'}}
  />)
};

DeleteButton.propTypes = {
  basePath: PropTypes.string,
  record: PropTypes.object,
};

export default DeleteButton;
