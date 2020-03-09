import React, { Component } from 'react';
import {
  Form, FormControl, Button, InputGroup, Spinner,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { validateOwnership } from '../operations';
import { cleanValidateOwnership } from '../actions';

class ValidateOwnershipComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.validate = this.validate.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
  }

  handleChangeValue(e) {
    this.setState({ value: e.target.value });

    const { clean } = this.props;
    clean();
  }

  validate(event) {
    event.preventDefault();
    const { validate } = this.props;
    const { value } = this.state;

    validate(value);
  }

  render() {
    const { loading, error } = this.props;

    return (
      <Form onSubmit={this.validate}>
        <Form.Group>
          <Form.Label>Choose the domain to register subdomains of</Form.Label>
          <InputGroup>
            <FormControl type="text" placeholder="domain.rsk" disabled={loading} onChange={this.handleChangeValue} />
            <InputGroup.Append>
              <Button type="submit" disabled={loading}>Validate</Button>
            </InputGroup.Append>
          </InputGroup>
          {
            loading && <Spinner variant="grow" />
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
      </Form>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.app.validateOwnership.loading,
  error: state.app.validateOwnership.error,
});

const mapDispatchToProps = (dispatch) => ({
  validate: (domain) => dispatch(validateOwnership(domain)),
  clean: () => dispatch(cleanValidateOwnership()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ValidateOwnershipComponent);
