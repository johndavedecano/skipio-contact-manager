import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { check, logout } from 'state/modules/auth';

export default function withAuthentication(Component) {
	class AuthenticatedComponent extends React.Component {
		static contextTypes = {
			router: PropTypes.object.isRequired
		};

		componentDidMount() {
			this.checkAuth();
		}

		checkAuth() {
			if (!this.props.token) {
				return this.goToLogin();
			}

			return this.props.check();
		}

		goToLogin() {
			const redirectAfterLogin = this.props.location.pathname;
			this.props.logout();
			this.context.router.replace(`/login?next=${redirectAfterLogin}`);
		}

		render() {
			return this.props.token && this.props.user
				? <Component {...this.props} router={this.context.router} />
				: null;
		}
	}

	const mapStateToProps = state => ({
		user: state.auth.get('user'),
		token: localStorage.getItem('token')
	});

	return connect(mapStateToProps, { check, logout })(AuthenticatedComponent);
}
