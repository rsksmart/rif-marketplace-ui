import React, { FC, useState } from 'react';
import { EProvider } from 'rifui/services/Web3Service';
import { shortenAddress } from 'rifui/utils'
import Web3 from 'web3';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Button, LoginOption, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Typography } from 'rifui';
import { colors, fonts } from 'rifui/theme';

export interface AccountProps {
  web3: Web3 | null;
  networkName: string | null;
  account: string | null;
  setProvider: (provider: EProvider) => void;
  providers?: EProvider[];
};

const useStyles = makeStyles((theme: Theme) => ({
  accountText: {
    fontSize: fonts.size.tiny,
  },
  root: {
    alignItems: 'center',
    color: colors.gray1,
    border: '1px solid white',
    borderRadius: 50,
    cursor: 'pointer',
    display: 'flex',
    flexWrap: 'nowrap',
    fontSize: fonts.size.small,
    height: '100%',
    justifyContent: 'center',
    padding: theme.spacing(1),
    width: '100%',
  },
}));

const Account: FC<AccountProps> = ({
  web3,
  networkName,
  account,
  setProvider,
  providers,
}) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <div
        onClick={handleOpen}
        className={classes.root}
      >
        <Typography className={classes.accountText}>
          {!web3 && 'Connect wallet'}
          {web3 && networkName}
          {web3 && account && shortenAddress(account)}
        </Typography>
      </div>

      <Modal
        open={open} onClose={handleClose}
        aria-labelledby="account-modal-title"
        aria-describedby="account-modal-description">
        <>
          <ModalHeader>
            <ModalTitle>
              Connect a wallet to get started
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            {(providers || [EProvider.METAMASK, EProvider.LOCAL]).map(
              provider => (
                <LoginOption
                  key={provider}
                  text={provider}
                  onClick={() => {
                    setProvider(provider);
                    handleClose();
                  }}
                />
              ),
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant='outlined' color='secondary' block onClick={handleClose}>Close</Button>
          </ModalFooter>
        </>
      </Modal>
    </>
  );
};

export default Account;
