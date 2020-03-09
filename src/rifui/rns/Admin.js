import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default () => (
  <Container>
    <Row>
      <div className="col-lg-12 text-center main-title-box">
        <h1><b>Admin</b></h1>
      </div>
      <Col>
        <ul>
          <li>Add registrant</li>
          <li>Remove registrant</li>
          <li>Check registrant</li>
          <li>Recover domain ownership</li>
        </ul>
      </Col>
    </Row>
    <Row>
      <Col>
        <p>
          This section is in development. Find the
          <span> </span>
          <a href="https://github.com/rnsdomains/rns-subdomain-batch/projects/1" target="_blank" rel="noopener noreferrer">Github project</a>
          <span> </span>
          to collaborate.
        </p>
      </Col>
    </Row>
  </Container>
);
