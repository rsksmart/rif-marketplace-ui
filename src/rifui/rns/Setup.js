import React from 'react';
import { connect } from 'react-redux';
import {
  Container, Row, Col, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ValidateOwnership from './ValidateOwnership';
import Claim from './Claim';
import TransferToRegistrar from './TransferToRegistrar';

const Setup = ({ domain, claimed, transferred }) => (
  <Container className="text-center">
    <div className="col-lg-12 main-title-box">
      <h1><b>Setup</b></h1>
    </div>
    <p>
      The setup process consist of transferring the domain momentarily
      to the subdomain registrar, a smart contract that allows to register
      subdomains to selected operators.
    </p>
    <Row>
      <Col>
        {domain ? <h2>{domain}</h2> : <ValidateOwnership />}
      </Col>
    </Row>
    {
      domain
      && (
        <>
          <hr />
          <Row>
            <Col>
              <p>Now you have to execute 2 transactions. You will need to do this just once.</p>
              <p>
                Claim your domain
                {' '}
                <OverlayTrigger
                  placement="top"
                  overlay={(
                    <Tooltip id="tooltip1-top">
                      Claim your domain in the batch registrar contract. This will set you as the
                      <span> </span>
                      admin of the domain and the only registrant. Will also give you permission to
                      <span> </span>
                      add ore remove other registrants, and recover your domain ownership.
                    </Tooltip>
                  )}
                >
                  <span className="text-info"> ?</span>
                </OverlayTrigger>
              </p>
              <Claim />
              <p>
                Transfer ownership to Subdomain Registrar.
                {' '}
                <OverlayTrigger
                  placement="top"
                  overlay={(
                    <Tooltip id="tooltip2-top">
                      This will set the smart contract as the owner of the RNS domain.
                      <span> </span>
                      You can recover your domain ownership when you want to.
                    </Tooltip>
                  )}
                >
                  <span className="text-info"> ?</span>
                </OverlayTrigger>
              </p>
              <TransferToRegistrar enabled={claimed} />
            </Col>
          </Row>
        </>
      )
    }
    {
      domain && transferred
      && (
        <>
          <hr />
          <p>
            Done!
          </p>
          <p>
            {'Please '}
            <Link to="/subdomains">validate your csv files</Link>
            {' before executing any registration.'}
          </p>
        </>
      )
    }
  </Container>
);

const mapStateToProps = ({ app }) => ({
  domain: app.domain,
  claimed: !!app.claim.tx,
  transferred: !!app.transferToRegistrar.tx,
});

export default connect(mapStateToProps)(Setup);
