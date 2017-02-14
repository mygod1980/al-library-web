/**
 * Created by eugenia on 05.11.16.
 */
import React, {PropTypes} from 'react';

export default class SubdocumentArrayField extends React.Component {
  static propTypes = {
    source: PropTypes.string.isRequired,
    reference: PropTypes.string.isRequired,
    link: PropTypes.bool,
    displaySource: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired
  };

  render() {
    const {record, source, displaySource, reference, style = {}, link} = this.props;

    return (

      <div className="subdocuments-array">{record[source].map((item, index) => {
        let label = '';
        let isLast = record[source].length - index === 1;

        if (Array.isArray(displaySource)) {
          displaySource.map((prop) => {
            label += `${item[prop] || ''} `;
            return label;
          });
        } else {
          label = `${item[displaySource]}`;
        }

        label = label.trim();
        return (
          <p key={item._id}>
            {
              link ?
                <a style={style} href={`#/resources/${reference}/${item._id}/show`}>
                  {isLast ? label : `${label}, `}
                </a> :
                <span>{isLast ? label : `${label}, `}</span>
            }

          </p>);
      })}
      </div>);
  }
}