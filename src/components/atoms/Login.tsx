import React from 'react'
import { Account, Web3Provider } from '@rsksmart/rif-ui'

const requiredNetworkId = process.env.REACT_APP_REQUIRED_NETWORK_ID || 8545
const requiredNetworkName = process.env.REACT_APP_REQUIRED_NETWORK_NAME

const Login = () => {
  const onNetworkMismatchMessage = 'You are on the wrong network.'
  const noNetworkMessage = 'You are not connected to any network.'

  return (
    <Web3Provider.Consumer>
      {({ state: { web3, account, networkInfo }, actions: { setProvider } }) => (
        <Account
          web3={web3}
          account={account}
          setProvider={setProvider}
          requiredNetworkId={requiredNetworkId}
          currentNetworkId={networkInfo?.networkId}
          onNetworkMismatchMessage={
            requiredNetworkName
              ? `${onNetworkMismatchMessage} Please, connect to ${requiredNetworkName}.`
              : onNetworkMismatchMessage
          }
          noNetworkMessage={
            requiredNetworkName
              ? `${noNetworkMessage} Please, connect to ${requiredNetworkName}.`
              : noNetworkMessage
          }

        />
      )}
    </Web3Provider.Consumer>
  )
}

export default Login
