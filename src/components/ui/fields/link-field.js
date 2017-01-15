/**
 * Created by eugenia on 10.11.16.
 */
import React, {PropTypes} from "react";

const LinkField = ({record = {}, source, link, replaceProp, displayName, ...other}) => {
  delete other.basePath;
  delete other.input;
  let url = link.replace(`:${replaceProp}`, record[replaceProp]);
  let className = '';

  if (!record[source]) {
    className = 'disabled';
    url = '#';
  }

  return (
    <a style={{cursor: 'pointer'}}
       {...other}
       className={className}
       href={url}>
      {displayName || record[source]}
    </a>
  );
};

LinkField.propTypes = {
  source: PropTypes.string.isRequired,
  record: PropTypes.object,
  link: PropTypes.string.isRequired,
  replaceProp: PropTypes.string.isRequired,
  displayName: PropTypes.string
};

export default LinkField;