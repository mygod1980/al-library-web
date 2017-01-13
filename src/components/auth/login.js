/**
 *
 * Created by eugenia on 20.09.16.
 */
import React, {PropTypes} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import  '../../css/login.css';
import auth from '../../util/auth';
import {config} from '../../config';
import {setLoadingState, notify, logout} from '../../reducers/wrapper/actions';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      usernameError: '',
      passwordError: ''
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const email = this.refs.username.input.value;
    const password = this.refs.password.input.value;
    if (!email) {
      return this.setState({usernameError: config.errors.email.required});
    }

    if (!password) {
      return this.setState({passwordError: config.errors.password.required});
    }

    if (!this._checkUsernameValidity(email)) {
      return this.setState({usernameError: config.errors.email.invalid});
    }

    this.props.dispatch(setLoadingState());

    return auth.login(email, password)
      .then(() => {
        return this.props.router.replace('resources/publications');
      })
      .catch((err) => {
        console.debug('Error while logging in');
        console.error(err);

        this.props.dispatch(notify({
          type: config.notificationTypes.error,
          text: err && (err.error || err.message)
        }));
      });

  };

  _checkUsernameValidity = (email) => {
    const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return emailRegExp.test(email);
  };

  _watchUsername = () => {
    const email = this.refs.username.input.value;

    if (!this._checkUsernameValidity(email)) {
      return this.setState({usernameError: config.errors.email.invalid});
    }

    return this.setState({usernameError: ''});
  };

  render() {
    return (
      <div className="login">
        <hgroup>
          <h1 className="header">Вхід</h1>
        </hgroup>
        <form onSubmit={this.handleSubmit} noValidate>
          <div>
            <TextField type="email"
                       hintText="Email"
                       required
                       ref="username"
                       onBlur={this._watchUsername}
                       floatingLabelText="Email"
                       errorText={this.state.usernameError}/>
          </div>

          <div>
            <TextField type="password"
                       hintText="Пароль"
                       required
                       ref="password"
                       floatingLabelText="Пароль"
                       errorText={this.state.passwordError}/>
          </div>

          <RaisedButton type="submit"
                        label={this.props.isLoading ?
                        "Виконується вхід..." :
                        "Увійти"}
                        className="submit-btn" primary={true} disabled={this.props.isLoading}/>
        </form>

      </div>
    );
  }
}

Login.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return {isLoading: state.wrapper.isLoading};
};

export default connect(mapStateToProps)(withRouter(Login));