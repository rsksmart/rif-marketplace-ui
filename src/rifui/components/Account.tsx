import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { EProvider } from 'rifui/services/Web3Service';

const Option = ({ text, onClick, disabled = false }) => (
  <>
    {disabled && (
      <div
        style={{
          padding: 5,
          margin: 5,
          border: '1px solid #ccc',
          borderRadius: '4px',
          color: '#ccc',
          cursor: 'default',
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    )}
    {!disabled && (
      <div
        style={{
          padding: 5,
          margin: 5,
          border: '1px solid #222',
          borderRadius: '4px',
          cursor: 'pointer',
          textAlign: 'center',
        }}
        onClick={onClick}
      >
        {text}
      </div>
    )}
  </>
);

export default ({ web3, networkName, accounts, setProvider }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div
        onClick={handleShow}
        style={{
          color: '#000',
          border: '1px solid #222',
          padding: '5px',
          cursor: 'pointer',
        }}
      >
        {!web3 && 'Connect wallet'}
        {web3 && `${networkName} ${accounts}`}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>Connect a wallet to get started</Modal.Header>
        <Modal.Body>
          <div
            style={{
              width: '100%',
              listStyle: 'none',
            }}
          >
            <Option
              text={'MetaMask'}
              onClick={() => {
                setProvider(EProvider.METAMASK);
                handleClose();
              }}
            />
            <Option
              text={'Ledger'}
              disabled
              onClick={() => {
                setProvider(EProvider.LEDGER);
                handleClose();
              }}
            />
            <Option
              text={'Trezor'}
              disabled
              onClick={() => {
                setProvider(EProvider.TREZOR);
                handleClose();
              }}
            />
            <Option
              text={'localhost:4444'}
              onClick={() => {
                setProvider(EProvider.LOCAL);
                handleClose();
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
