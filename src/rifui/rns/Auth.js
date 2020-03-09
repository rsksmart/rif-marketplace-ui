import React, { Component } from 'react';
import {
  Container, Row, Col, Form, FormControl, Button, InputGroup, Spinner,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { auth } from '../operations';
import { Link } from 'react-router-dom';

class ValidateOwnershipComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.authenticate = this.authenticate.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
  }

  handleChangeValue(e) {
    this.setState({ value: e.target.value });
  }

  authenticate(event) {
    event.preventDefault();
    const { auth } = this.props;
    const { value } = this.state;

    auth(value);
  }

  render() {
    const { authenticating, error, permissions, domain } = this.props;

    return (
      <Container className="text-center">
        <Row>
          <Col>
            {
              permissions.length === 0 ?
              <Form onSubmit={this.authenticate}>
                <Form.Group>
                  <InputGroup>
                    <FormControl type="text" placeholder="domain.rsk" disabled={authenticating} onChange={this.handleChangeValue} />
                    <InputGroup.Append>
                      <Button type="submit" disabled={authenticating}>Log in</Button>
                    </InputGroup.Append>
                  </InputGroup>
                  {
                    authenticating && <Spinner variant="grow" />
                  }
                  {
                    error
                    && (
                      <>
                        <small className="text-danger">{error}</small>
                        <br />
                        <small>
                          Check you are connected to RSK network with
                          <span> </span>
                          the owner&aposs wallet unlocked.
                        </small>
                      </>
                    )
                  }
                </Form.Group>
              </Form> :
              <>
                <p>Welcome {domain}!</p>
                <Link className="btn btn-success" to="/subdomains">Register subdomains</Link>
              </>
            }
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <p>
              Please complete the
              <span> </span><Link to="/setup">setup</Link><span> </span>
              before logging in.
            </p>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  permissions: app.auth.permissions,
  authenticating: app.auth.authenticating,
  error: app.auth.error,
  domain: app.domain,
});

const mapDispatchToProps = (dispatch) => ({
  auth: (domain) => dispatch(auth(domain)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ValidateOwnershipComponent);
