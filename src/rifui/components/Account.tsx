import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { EProvider } from 'rifui/services/Web3Service';
import LoginOption from './LoginOption';
import { shortenAddress } from '../utils';
import Web3 from 'web3';

interface IProps {
  web3: Web3 | null;
  networkName: string | null;
  account: string | null;
  setProvider: (provider: EProvider) => void;
  providers?: EProvider[];
}

export default ({
  web3,
  networkName,
  account,
  setProvider,
  providers,
}: IProps) => {
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
          fontSize: '12px',
          width: '250px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
        }}
      >
        {!web3 && <div>Connect wallet</div>}
        {web3 && <div>{networkName}</div>}
        {web3 && account && <div>{shortenAddress(account)}</div>}
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
            {(providers || [EProvider.METAMASK, EProvider.LOCAL]).map(
              provider => (
                <LoginOption
                  text={provider}
                  onClick={() => {
                    setProvider(provider);
                    handleClose();
                  }}
                />
              ),
            )}
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
