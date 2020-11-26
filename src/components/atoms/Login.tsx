import React, { FC } from 'react'
import { Account, Web3Provider } from '@rsksmart/rif-ui'
import { networkId, networkName } from 'config'

export interface LoginProps {
  modalInitiallyOpened?: boolean
}

const Login: FC<LoginProps> = ({ modalInitiallyOpened = false }) => {
  const onNetworkMismatchMessage = 'You are on the wrong network.'
  const noNetworkMessage = 'You are not connected to any network.'

  return (
    <Web3Provider.Consumer>
      {({ state: { web3, account, networkInfo }, actions: { setProvider }, availableProviders }) => (
        <Account
          web3={web3}
          account={account}
          setProvider={setProvider}
          requiredNetworkId={networkId}
          networkInfo={networkInfo}
          requiredNetworkName={networkName}
          onNetworkMismatchMessage={
            networkName
              ? `${onNetworkMismatchMessage} Please, connect to ${networkName}.`
              : onNetworkMismatchMessage
          }
          noNetworkMessage={
            networkName
              ? `${noNetworkMessage} Please, connect to ${networkName}.`
              : noNetworkMessage
          }
          availableProviders={availableProviders}
          modalInitiallyOpened={modalInitiallyOpened}
        />
      )}
    </Web3Provider.Consumer>
  )
}

export default Login
