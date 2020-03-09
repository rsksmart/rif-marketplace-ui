import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { NODE_OWNER, REGISTRANT } from '../types';

const Header = ({ authenticatedAs, showRegister, showAdmin }) => (
  <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
    <div className="container">
      <Link className="navbar-brand" to="/">
        <img src="assets/img/logo.svg" className="logo" alt="logo" />
      </Link>
      <h3>
        Subdomain batch
      </h3>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/setup">Setup</Link>
          </li>
          {
            showRegister &&
            <li className="nav-item">
              <Link className="nav-link" to="/subdomains">Register subdomains</Link>
            </li>
          }
          {
            showAdmin &&
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Admin</Link>
            </li>
          }
          <li className="nav-item">
            <Link className="nav-link" to="/faq">FAQ</Link>
          </li>
          <li className="nav-item">
            <Link className="btn btn btn-primary my-2 my-sm-0" to={!authenticatedAs ? '/login' : ''}>
              {authenticatedAs || 'Login'}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

const mapStateToProps = ({ app }) => ({
  authenticatedAs: app.auth.permissions.length > 0 && app.domain,
  showRegister: app.auth.permissions.includes(REGISTRANT),
  showAdmin: app.auth.permissions.includes(NODE_OWNER),
});

export default connect(mapStateToProps)(Header);
