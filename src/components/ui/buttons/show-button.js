/**
 * Created by eugenia on 14.01.17.
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ImageEye from 'material-ui/svg-icons/image/remove-red-eye';

const ShowButton = ({basePath = '', record = {}, label = "Деталі"}) => <FlatButton
  primary
  label={label}
  icon={<ImageEye />}
  containerElement={<Link to={`${basePath}/${encodeURIComponent(record.id)}/show`}/>}
  style={{overflow: 'inherit'}}
/>;

ShowButton.propTypes = {
  basePath: PropTypes.string,
  record: PropTypes.object,
};

export default ShowButton;
