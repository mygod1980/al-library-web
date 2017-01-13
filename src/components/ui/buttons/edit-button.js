/**
 * Created by eugenia on 14.01.17.
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ContentCreate from 'material-ui/svg-icons/content/create';

const EditButton = ({basePath = '', record = {}, label = 'Редагувати'}) => <FlatButton
  primary
  label={label}
  icon={<ContentCreate />}
  containerElement={<Link to={`${basePath}/${encodeURIComponent(record.id)}`}/>}
  style={{overflow: 'inherit'}}
/>;

EditButton.propTypes = {
  basePath: PropTypes.string,
  record: PropTypes.object,
};

export default EditButton;
