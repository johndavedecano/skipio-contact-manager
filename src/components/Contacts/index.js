import React from 'react';
import { connect } from 'react-redux';
import withAuthentication from 'hoc/withAuthentication';
import { load, send } from 'state/modules/contacts';
import cx from 'classnames';
import styles from './styles.scss';

const Notification = ({ title, message, type = 'danger' }) => {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {title &&
        <strong>
          {title}
        </strong>}
      {message}
    </div>
  );
};

const DEFAULT_STATE = {
  isSending: false,
  isActive: false,
  message: '',
  notificationType: 'danger',
  notification: null
};

class Contact extends React.Component {
  state = {
    isSending: false,
    isActive: false,
    message: '',
    notificationType: 'danger',
    notification: null
  };

  handleKeyUp = e => {
    if (e.keyCode === 27) {
      this.setState(DEFAULT_STATE);
    }
  };

  onToggleContact = event => {
    event && event.preventDefault();
    this.setState({
      isActive: !this.state.isActive,
      message: ''
    });
  };

  // PERFORM SIDE EFFECT.
  onSubmit = e => {
    e.preventDefault();
    if (this.state.message === '') return false;
    this.setState({
      isSending: true,
      notification: null,
      notificationType: null
    });
    this.props
      .onSendMessage(this.props.id, this.state.message)
      .then(response => {
        const type = response.success ? 'success' : 'danger';
        this.setState({ isSending: false });
        this.showNotification(type, response.message);
        if (type === 'success') {
          this.onToggleContact();
        }
      });
  };

  showNotification(type, message) {
    this.setState({
      notificationType: type,
      notification: message
    });
    setTimeout(() => this.hideNotification(), 2000);
  }

  hideNotification() {
    this.setState({
      notificationType: null,
      notification: null
    });
  }

  onChange = e => {
    this.setState({
      message: e.target.value
    });
  };

  renderForm() {
    return (
      this.state.isActive &&
      <form onSubmit={this.onSubmit}>
        <textarea
          autoFocus
          className="form-control"
          placeholder={`Sending message to ${this.props.first_name} ${this.props
            .last_name} at ${this.props.phone_mobile}`}
          value={this.state.message}
          required
          onChange={this.onChange}
          onKeyUp={this.handleKeyUp}
        />
        <br />
        <button
          type="submit"
          disabled={this.state.isSending || this.state.message === ''}
          className="btn btn-primary btn-block"
        >
          {this.state.isSending ? 'Please Wait...' : 'Send Message'}
        </button>
        <button
          type="button"
          disabled={this.state.isSending}
          className="btn btn-danger btn-block"
          onClick={this.onToggleContact}
        >
          Cancel
        </button>
      </form>
    );
  }

  renderActionButton() {
    return (
      !this.state.isActive &&
      !this.state.notification &&
      <a
        href="#"
        className="btn btn-primary btn-block"
        onClick={this.onToggleContact}
      >
        Contact User
      </a>
    );
  }

  renderDescription() {
    return (
      !this.state.isActive &&
      !this.state.notification &&
      <p>
        Some quick example text to build on the card title and make up the bulk
        of the card's content.
      </p>
    );
  }

  render() {
    return (
      <div className={cx('col-md-6', styles.contact)}>
        <div className="card">
          <div className="card-block">
            {!this.state.isActive &&
              <h4 className="card-title">
                {this.props.first_name} {this.props.last_name}
              </h4>}
            {!this.state.isActive &&
              <h6 className="card-subtitle mb-2 text-muted">
                {this.props.email} | {this.props.phone_mobile}
              </h6>}
            {this.renderDescription()}
            {this.state.notification &&
              <Notification
                message={this.state.notification}
                type={this.state.notificationType}
              />}

            {this.renderForm()}
            {this.renderActionButton()}
          </div>
        </div>
      </div>
    );
  }
}

@withAuthentication
class Contacts extends React.Component {
  componentWillMount() {
    if (!this.props.isLoaded) {
      this.props.load({ page: 1, per: 25 }, true);
    }
  }

  loadMore = () => {
    this.props.load({ page: this.props.currentPage + 1, per: 25 });
  };

  renderLoadMore() {
    return (
      <button
        className="btn btn-primary btn-lg"
        disabled={this.props.isLoading}
        onClick={this.loadMore}
      >
        {this.props.isLoading ? 'Loading More...' : 'Load More'}
      </button>
    );
  }

  render() {
    return (
      <div className={styles.contacts}>
        <h1>
          <span className="badge badge-success">{this.props.total}</span>{' '}
          Contacts
        </h1>
        <p className="lead">
          Show all the contacts that belongs to your account.
        </p>
        {this.props.error &&
          <Notification
            title="On Snap!"
            message={this.props.error}
            type="danger"
          />}
        <div className="container">
          <div className="row">
            {this.props.contacts
              .map(contact => {
                return (
                  <Contact
                    key={contact.get('id')}
                    {...contact.toJS()}
                    onSendMessage={this.props.send}
                  />
                );
              })
              .toArray()}
            {this.props.hasNextPage && this.renderLoadMore()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  contacts: state.contacts.get('contacts'),
  currentPage: state.contacts.getIn(['meta', 'current_page']),
  total: state.contacts.getIn(['meta', 'total_count']),
  error: state.contacts.get('error'),
  isLoading: state.contacts.get('isLoading'),
  isLoaded: state.contacts.get('isLoaded'),
  hasNextPage: !!state.contacts.getIn(['meta', 'next_page'])
});

export default connect(mapStateToProps, { load, send })(Contacts);
