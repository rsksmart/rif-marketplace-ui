import React, { FC } from 'react'
import { AccountModal, Web3Provider } from '@rsksmart/rif-ui'

export interface LoginModalProps {
  open: boolean
  onProviderSet?: (account?: string) => void
  handleOnClose: () => void
}

const LoginModal: FC<LoginModalProps> = ({
  open,
  onProviderSet,
  handleOnClose,
}) => (
  <Web3Provider.Consumer>
    {
        ({
          state: { web3, networkInfo },
          actions: { setProvider },
          availableProviders,
        }) => (
          <AccountModal
            web3={web3}
            networkInfo={networkInfo}
            open={open}
            onProviderSet={onProviderSet}
            setProvider={setProvider}
            availableProviders={availableProviders}
            onClose={handleOnClose}
          />
        )
      }
  </Web3Provider.Consumer>
)

export default LoginModal
