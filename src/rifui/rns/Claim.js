import React from 'react';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bathRegistrarClaim } from '../operations';
import Tx from './Tx';

const ClaimComponent = ({
  claim, claiming, tx, error,
}) => (
  <Form onSubmit={(e) => {
    e.preventDefault();
    claim();
  }}
  >
    {!tx && <FormGroup><Button type="submit" disabled={claiming}>Claim</Button></FormGroup>}
    {tx && <small className="text-success"><Tx tx={tx.transactionHash} /></small>}
    {error && <small className="text-danger">{error.message}</small>}
  </Form>
);

const mapStateToProps = ({ app }) => ({
  ...app.claim,
  domain: app.domain,
  from: app.owner,
});

const mapDispatchToProps = (dispatch) => ({
  claim: (domain, from) => dispatch(bathRegistrarClaim(domain, from)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  claim: () => dispatchProps.claim(stateProps.domain, stateProps.from),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(ClaimComponent);
