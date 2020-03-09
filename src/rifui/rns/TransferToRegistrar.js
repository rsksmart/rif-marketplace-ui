import React from 'react';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { transferToRegistrar } from '../operations';
import Tx from './Tx';

const TransferToRegistrarComponent = ({
  enabled, transfer, transferring, tx, error,
}) => {
  const disabled = !enabled || transferring;

  return (
    <Form onSubmit={(e) => {
      e.preventDefault();
      transfer();
    }}
    >
      {!tx && (
      <FormGroup>
        <Button type="submit" className={disabled && 'btn-info'} disabled={disabled}>Transfer</Button>
      </FormGroup>
      )}
      {tx && <small className="text-success"><Tx tx={tx.transactionHash} /></small>}
      {error && <small className="text-danger">{error.message}</small>}
    </Form>
  );
};

const mapStateToProps = ({ app }) => ({
  ...app.transferToRegistrar,
  domain: app.domain,
  from: app.owner,
});

const mapDispatchToProps = (dispatch) => ({
  transfer: (domain, from) => dispatch(transferToRegistrar(domain, from)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  transfer: () => dispatchProps.transfer(stateProps.domain, stateProps.from),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(TransferToRegistrarComponent);
