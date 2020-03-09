import React, { Component } from 'react';
import {
  Container, Table, Spinner, Button,
} from 'react-bootstrap';
import CSVReader from 'react-csv-reader';
import { isAddress } from 'web3-utils';
import { connect } from 'react-redux';
import { isValidLabel } from '../lib';
import { confirmParsed } from '../actions';
import { push } from 'connected-react-router';
import { sha3 } from 'web3-utils';

const partSize = 50;

const parseSolvedErrors = (errors) => {
  let error = [];

  if (errors.labelNoSpaces) error.push('No spaces');
  if (errors.labelToLower) error.push('Lower cases');
  if (errors.noMails) error.push('No mails');
  if (errors.labelsNoEnie) error.push('No \'ñ\'');
  if (errors.noSeparators) error.push('No _ - . ,')
  if (errors.noTilde) error.push('No \'')

  return error.map(e => (
    <p key={e}>
      {e}
      <br />
    </p>
  ));
};

const parseUnsolvedErrors = (errors) => {
  let error = [];

  if (errors.invalidAddress) error.push('Invalid address');
  if (errors.invalidLabel) error.push('Invalid label');

  return error.map(e => (
    <p key={e}>
      {e}
      <br />
    </p>
  ));
};

const parsedToCsv = (parsed) => {
  let result = '';

  for (let i = 0; i < parsed.length; i += 1)
    result += `${parsed[i][0]},${parsed[i][1]}\n`;

  return result;
}

const download = (filename, text) => {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const parsedDataToParts = (parsedData) => {
  const labels = []
  const addresses = []

  for (let i = 0; i < parsedData.length; i += 1) {
    labels.push(sha3(parsedData[i][0]));
    addresses.push(parsedData[i][1]);
  }

  const amountOfParts = Math.floor(labels.length / partSize);

  const parts = []
  for (let i = 0; i < amountOfParts; i += 1) {
    parts.push({
      from: i * partSize,
      to: (i+1) * partSize,
      value: [
        labels.slice(i * partSize, (i+1) * partSize),
        addresses.slice(i * partSize, (i+1) * partSize),
      ],
    });
  }

  parts.push({
    from: amountOfParts * partSize,
    to: labels.length,
    value: [
      labels.slice(amountOfParts * partSize, labels.length),
      addresses.slice(amountOfParts * partSize, addresses.length),
    ]
  });

  return parts;
}

class Subdomains extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validating: false,
      data: null,
      allSolvedConflicts: [],
      allUnsolvedConflicts: [],
      parsed: null,
    };

    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.accept = this.accept.bind(this);
    this.handleDownloadParsed = this.handleDownloadParsed.bind(this);
    this.accept = this.accept.bind(this);
  }

  handleUploadFile(data) {
    this.setState({ validating: true });

    const allSolvedConflicts = [];
    const allUnsolvedConflicts = [];

    const parsed = [];

    for (let i = 0; i < data.length; i += 1) {
      let [label, address] = data[i];

      const solvedConflicts = {};
      const unsolvedConflicts = {};

      // solvable
      if (label.indexOf(' ') >= 0) {
        label = label.replace(/ /g, '');
        solvedConflicts.labelNoSpaces = true;
      }

      if (label !== label.toLowerCase()) {
        label = label.toLowerCase();
        solvedConflicts.labelToLower = true;
      }

      const indexOfAt = label.indexOf('@');
      if (indexOfAt >= 0) {
        label = label.slice(0, indexOfAt);
        solvedConflicts.noMails = true;
      }

      if (label.indexOf('ñ') >= 0) {
        label = label.replace(/(ñ)/g, 'n');
        solvedConflicts.labelsNoEnie = true;
      }

      if(label.match(/[-_.,]/g)) {
        label = label.replace(/(\.)/g, '');
        label = label.replace(/(_)/g, '');
        label = label.replace(/(-)/g, '');
        label = label.replace(/(,)/g, '');
        solvedConflicts.noSeparators = true;
      }

      if(label.match(/[áéíóúü]/g)) {
        label = label.replace(/(á)/g, 'a');
        label = label.replace(/(é)/g, 'e');
        label = label.replace(/(í)/g, 'i');
        label = label.replace(/(ó)/g, 'o');
        label = label.replace(/(ú)/g, 'u');
        label = label.replace(/(ü)/g, 'u');
        solvedConflicts.noTilde = true;
      }

      // unsolvable
      address = address.toLowerCase();

      if (!isAddress(address)) {
        unsolvedConflicts.invalidAddress = true;
      }

      if (!isValidLabel(label))
        unsolvedConflicts.invalidLabel = true;

      allSolvedConflicts.push(solvedConflicts);
      allUnsolvedConflicts.push(unsolvedConflicts);
      parsed.push([label, address]);
    }

    this.setState({
      validating: false,
      data,
      allSolvedConflicts,
      allUnsolvedConflicts,
      parsed,
    });
  }

  handleDownloadParsed() {
    const { parsed } = this.state;

    download(`subdomains-${Date.now()}.csv`, parsedToCsv(parsed));
  }

  accept() {
    const { confirmParsed, goToRegister } = this.props;
    const { parsed } = this.state;

    confirmParsed(parsedDataToParts(parsed));
    goToRegister();
  }

  render() {
    const {
      validating,
      data,
      allSolvedConflicts,
      allUnsolvedConflicts,
      parsed,
    } = this.state;

    const anyUnsolved = allUnsolvedConflicts.length > 0 && allUnsolvedConflicts.some(c => Object.keys(c).length > 0);

    const { domain } = this.props;

    return (
      <Container className="text-center">
        <div className="col-lg-12 main-title-box">
          <h1><b>Register subdomains</b></h1>
        </div>
        <p>
          Register subdomains importing a <code>csv</code> file.
        </p>
        <p>
          The
          {' '}
          <code>csv</code>
          {' '}
file must include only two columns:
            the labels to register in the first column
            and the address to set in the second column.
        </p>
        <p>
          First validate the entries. The app will apply some changes
          <span> </span>and request to approve them before registering.
        </p>
        <CSVReader onFileLoaded={this.handleUploadFile} disabled={validating} />
        {validating && <Spinner animation="grow" />}
        {
          !validating && parsed && (
            anyUnsolved ?
            <p>
              Some format conflict was found and not solved. Subdomains&#32;
              Subdomains must be lowercase alfanumeric values and addresses&#32;
              must be 20 bytes hex.
            </p> :
            <>
              <p>
                All found conflicts were solved. <Button variant="link" onClick={this.handleDownloadParsed}>Download</Button> the&#32;
                resultant <code>csv</code> file.
              </p>
              <Button onClick={this.accept}>Register!</Button>
            </>
          )
        }
        <hr />
        {
          !validating && parsed
          && (
            <>
              <p>Check all solved conflicts in yellow and unsolved in red.</p>
              <Table>
                <thead>
                  <tr>
                    <th>input</th>
                    <th>solved conflicts</th>
                    <th>unsolved conflicts</th>
                    <th>to register</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.map((value, index) => (
                      <tr
                        key={`${value[1]}${index}`}
                        className={
                          Object.keys(allUnsolvedConflicts[index]).length > 0 ?
                          'table-danger' :
                          (
                            Object.keys(allSolvedConflicts[index]).length > 0 ?
                            'table-warning' :
                            ''
                          )
                        }
                      >
                        <td>{`(${value[0]}, ${value[1]})`}</td>
                        <td >{parseSolvedErrors(allSolvedConflicts[index])}</td>
                        <td>{parseUnsolvedErrors(allUnsolvedConflicts[index])}</td>
                        <td>{`(${parsed[index][0]}.${domain}, ${parsed[index][1]})`}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
            </>
          )
        }
        <hr />
      </Container>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  domain: app.domain,
});

const mapDispatchToProps = (dispatch) => ({
  confirmParsed: (parsed) => dispatch(confirmParsed(parsed)),
  goToRegister: () => dispatch(push('/register')),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Subdomains);
