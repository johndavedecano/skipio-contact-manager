import React from 'react';
import styles from './styles.scss';
import { connect } from 'react-redux';
import { login, logout } from 'state/modules/auth';
import { withRouter } from 'react-router';

@withRouter
class Login extends React.Component {
	state = {
		token: ''
	};

	componentDidMount() {
		this.props.logout();
	}

	getNextPage() {
		const { query } = this.props.location;
		return query && query.next ? query.next : '/';
	}

	onSubmit = e => {
		e.preventDefault();
		this.props.login(this.state.token).then(success => {
			if (success) {
				this.props.router.replace(this.getNextPage());
			}
		});
	};

	onChange = e => {
		this.setState({
			token: e.target.value
		});
	};

	render() {
		return (
			<div className="starter-template">
				<h1>Login Here</h1>
				<p className="lead">
					Please provide your authentication to login.
				</p>
				<div className="row">
					<div className={styles.loginForm}>
						{this.props.error &&
							<div className="alert alert-danger">
								{this.props.error}
							</div>}
						<form onSubmit={this.onSubmit}>
							<input
								placeholder="Authentication Token"
								required
								className="form-control"
								type="text"
								value={this.state.token}
								disabled={this.props.isLoading}
								onChange={this.onChange}
							/>
							<button
								disabled={this.props.isLoading}
								type="submit"
								className="btn btn-lg btn-block btn-primary"
							>
								{this.props.isLoading ? 'Please Wait' : 'Login'}
							</button>
						</form>
					</div>
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

export default connect(mapStateToProps, { login, logout })(Login);
