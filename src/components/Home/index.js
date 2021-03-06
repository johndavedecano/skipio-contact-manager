import React from 'react';
import withAuthentication from 'hoc/withAuthentication';
import styles from './styles.scss';

@withAuthentication
class Home extends React.Component {
  render() {
    return (
      <div className="starter-template">
        <h1>Welcome To Our Home Page</h1>
        <p className="lead">
          Use this document as a way to quickly start any new project.<br /> All
          you get is this text and a mostly barebones HTML document.
        </p>
      </div>
    );
  }
}

export default Home;
