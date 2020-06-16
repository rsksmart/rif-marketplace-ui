import React from 'react'
import { Account, Web3Provider } from '@rsksmart/rif-ui'

const requiredNetworkId = process.env.REQUIRED_NETWORK || 31

const Login = () => (
  <Web3Provider.Consumer>
    {({ state: { web3, account, networkInfo }, actions: { setProvider } }) => (
      <Account
        web3={web3}
        account={account}
        setProvider={setProvider}
        requiredNetworkId={requiredNetworkId}
        currentNetworkId={networkInfo?.networkId}
      />
    )}
  </Web3Provider.Consumer>
)

export default Login
