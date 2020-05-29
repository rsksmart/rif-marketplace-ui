import React, { FC } from 'react'
import { AccountModal, Web3Provider } from '@rsksmart/rif-ui'

export interface LoginModalProps {
  open: boolean
  onProviderSet?: (account: string) => void
}

const LoginModal: FC<LoginModalProps> = ({
  open,
  onProviderSet,
}) => (
  <Web3Provider.Consumer>
    {({ state: { web3, networkName }, actions: { setProvider } }) => (
      <AccountModal
        web3={web3}
        networkName={networkName}
        open={open}
        onProviderSet={onProviderSet}
        setProvider={setProvider}
      />
    )}
  </Web3Provider.Consumer>
)

export default LoginModal
