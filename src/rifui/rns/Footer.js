import React from 'react';
import { Container, Row } from 'react-bootstrap';

export default () => (
  <footer>
    <div className="footer-top">
      <Container>
        <Row>
          <div className="col-lg-12">
            <img src="assets/img/powered_by_iov.svg" className="img-fluid powered_by" alt="powered_by" />
          </div>
          <div className="col-lg-4">
            <span className="footer-title mb-3">What is RNS?</span>
            <p className="mb-5">RIF Name Service provides an architecture which enables the identification of blockchain addresses by human-readable names.</p>
          </div>
          <div className="col-lg-3" />
          <div className="col-lg-3" />
          <div className="col-lg-2">
            <a href="https://gitter.im/rsksmart/rif-name-service" target="_blank" rel="noopener noreferrer">Gitter</a>
            <a href="https://rsksamrt.github.io/rif.rns/tools/subdomain-batch" target="_blank" rel="noopener noreferrer">Docs</a>
            <a href="https://github.com/rnsdomains/rns-subdomain-batch" target="_blank" rel="noopener noreferrer">Issues</a>
          </div>
        </Row>
      </Container>
    </div>
  </footer>
);
