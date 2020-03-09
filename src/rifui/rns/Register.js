import React from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { register } from '../operations';
import Tx from './Tx';

const Register = ({ register, data, registerResults }) => (
  <Container className="text-center">
    <div className="col-lg-12 main-title-box">
      <h1><b>Execute registration</b></h1>
    </div>
    {
      data.map((dataRow, i) => {
        const { tx, error, registering, index } = registerResults[i];

        return (
          <Row key={index}>
            <Col>From {dataRow.from} to {dataRow.to}</Col>
            <Col>
              <Form onSubmit={(e) => {
                e.preventDefault();
                register(dataRow.value[0], dataRow.value[1], index);
              }}
              >
                {
                  !tx &&
                  <FormGroup>
                    <Button type="submit" disabled={registering || (tx && !!tx.transactionHash)}>Register</Button>
                  </FormGroup>
                }
                {tx && <small className="text-success"><Tx tx={tx.transactionHash} /></small>}
                {error && <small className="text-danger">{error.message}</small>}
              </Form>
            </Col>
          </Row>
        );
      })
    }
  </Container>
);

const mapStateToProps = ({ app }) => ({
  data: app.parsed,
  domain: app.domain,
  owner: app.owner,
  registerResults: app.register,
});

const mapDispatchToProps = (dispatch) => ({
  register: (domain, labels, addresses, from, index) => dispatch(register(domain, labels, addresses, from, index)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  register: (labels, addresses, index) => dispatchProps.register(
    stateProps.domain,
    labels,
    addresses,
    stateProps.owner,
    index,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Register);
