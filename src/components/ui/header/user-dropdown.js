/**
 * Created by eugenia on 23.09.16.
 */
import React from "react";
import {connect} from "react-redux";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton/IconButton";
import ExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import {lightBlue50} from "material-ui/styles/colors";
import {config} from '../../../config';
const colorStyle = {color: lightBlue50};
class UserDropDown extends React.Component {

  render() {

    const moveToLogin = () => {
      return this.props.router.replace('logout');
    };

    const moveToOwnProfile = () => {
      return this.props.router.replace(`resources/users/${this.props.user._id}`);
    };

    const style = Object.assign(colorStyle, {padding: '0'});

    return (<IconMenu
      iconButtonElement={<IconButton iconStyle={style}><ExpandMoreIcon /></IconButton>}
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
    >

      {this.props.isAdmin && <MenuItem onClick={moveToOwnProfile}>
        Мій профіль
      </MenuItem>}


      <MenuItem onClick={moveToLogin}>
        Вийти
      </MenuItem>

    </IconMenu>)
  };
}


const mapStateToProps = (state) => ({
  user: state.wrapper.user,
  isAdmin: state.wrapper.user.role === config.roles.ADMIN
});


export default connect(mapStateToProps)(UserDropDown);