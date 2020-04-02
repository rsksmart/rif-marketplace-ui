import React, { FC, useState } from 'react';
import { EProvider } from 'rifui/services/Web3Service';
import { shortenAddress } from 'rifui/utils'
import Web3 from 'web3';
import { Button, LoginOption, Modal, Typography } from '../atoms';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { colors, fonts } from 'rifui/theme';

export interface AccountProps {
  web3: Web3 | null;
  networkName: string | null;
  account: string | null;
  setProvider: (provider: EProvider) => void;
  providers?: EProvider[];
};

// TODO: extract Modal title, body, open and close buttons when the new Modal Component is ready
const useStyles = makeStyles((theme: Theme) => ({
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
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    width: '100%',
  },
  modalContent: {
    width: '100%'
  },
  modalHeader: {
    borderBottom: `1px solid ${colors.gray2}`,
    width: '100%'
  },
  modalBody: {
    padding: theme.spacing(3),
    width: '100%',
  },
  modalFooter: {
    borderTop: `1px solid ${colors.gray2}`,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(1),
    width: '100%',
  }
}))

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
        {!web3 && <div>Connect wallet</div>}
        {web3 && <div>{networkName}</div>}
        {web3 && account && <div>{shortenAddress(account)}</div>}
      </div>

      <Modal
        open={open} onClose={handleClose}
        aria-labelledby="account-modal-title"
        aria-describedby="account-modal-description">
        <div className={classes.modalContent}>
          <div className={classes.modalHeader}>
            <Typography variant='h5'>
              Connect a wallet to get started
            </Typography>
          </div>
          <div className={classes.modalBody}>
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
          </div>
          <div className={classes.modalFooter}>
            <Button variant='outlined' onClick={handleClose}>Close</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Account;
