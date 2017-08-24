import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import styles from './styles.scss';
import { connect } from 'react-redux';
import { login, logout } from 'state/modules/auth';
import { withRouter } from 'react-router';
import cx from 'classnames';

@withRouter
class App extends React.Component {
  state = {
    token: ''
  };

  onLogout = e => {
    e.preventDefault();
    this.props.logout();
    this.props.router.replace('/login');
  };

  render() {
    return (
      <div>
        <nav
          className={cx(
            'navbar navbar-toggleable-md navbar-inverse bg-inverse fixed-top',
            styles.navbar
          )}
        >
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            data-target="#navbarsExampleDefault"
            aria-controls="navbarsExampleDefault"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <a className="navbar-brand" href="#">
            <img src="https://skipio.com/wp-content/uploads/2017/05/logo.png" />
          </a>
          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contacts">
                  Contacts
                </Link>
              </li>
              {this.props.user.size > 0 &&
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={this.onLogout}>
                    Logout
                  </Link>
                </li>}
              {this.props.user.size === 0 &&
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>}
            </ul>
            {this.props.user.size > 0 &&
              <div className="my-2 my-lg-0">
                <span className={styles.welcome}>
                  Hello {this.props.user.get('first_name')}!
                </span>
              </div>}
          </div>
        </nav>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.get('user'),
  isLoading: state.auth.get('isLoading'),
  error: state.auth.get('error')
});

export default connect(mapStateToProps, { login, logout })(App);
