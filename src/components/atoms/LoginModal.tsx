import React, { FC } from 'react'
import { AccountModal, Web3Provider } from '@rsksmart/rif-ui'

export interface LoginModalProps {
  open: boolean
  handleClose: () => void
}

const LoginModal: FC<LoginModalProps> = ({ open, handleClose }) => (
  <Web3Provider.Consumer>
    {({ state: { web3, networkName }, actions: { setProvider } }) => (
      <AccountModal
        web3={web3}
        networkName={networkName}
        open={open}
        handleClose={handleClose}
        setProvider={setProvider}
      />
    )}
  </Web3Provider.Consumer>
)

export default LoginModal
