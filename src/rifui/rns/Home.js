import React, { Component } from 'react';
import {
  Form,
  Container,
  Button,
  InputGroup,
  FormControl,
  FormGroup,
  Row,
  Col,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { isValidLabel } from '../lib';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      label: '',
      valid: true,
    };

    this.handleChangeLabel = this.handleChangeLabel.bind(this);
  }

  handleChangeLabel(event) {
    const label = event.target.value;

    this.setState({
      label,
      valid: isValidLabel(label),
    });
  }

  render() {
    const { label, valid } = this.state;

    return (
      <Container>
        <div className="col-lg-12 text-center main-title-box">
          <h1><b>RNS Subdomains</b></h1>
          <p>
            Use this tool to create subdomains in batch.
          </p>
          <hr />
          <h2>Requirements</h2>
          <Row>
            <Col>
              <h3>Browser wallet</h3>
              <a
                href="https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid"
                target="_blank"
                rel="noopener noreferrer"
              >
              Nifty Wallet
              </a>
              {' (recommended) or '}
              <a
                href="https://metamask.io"
                target="_blank"
                rel="noopener noreferrer"
              >
              Metamask
              </a>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <h3>An RNS domain</h3>
              <Form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (valid) window.open(`https://manager.rns.rifos.org/search?domain=${label}`);
                }}
                method="get"
                target="_blank"
              >
                <FormGroup>
                  <InputGroup>
                    <FormControl type="text" onChange={this.handleChangeLabel} className={!valid && 'is-invalid'} />
                    <InputGroup.Append>
                      <InputGroup.Text>.rsk</InputGroup.Text>
                    </InputGroup.Append>
                    <InputGroup.Append>
                      <Button type="submit">Register</Button>
                    </InputGroup.Append>
                  </InputGroup>
                  {
                    !valid
                    && (
                    <Form.Text className="text-muted">
                      Only lower cases or numbers.
                    </Form.Text>
                    )
                  }
                </FormGroup>
              </Form>
              <i>Skip this if you already own one with your browser wallet.</i>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <h3>Setup</h3>
              <Link to="/setup">Setup</Link>
              {' your domain to register subdomains in batch'}
            </Col>
          </Row>
        </div>
      </Container>
    );
  }
}
