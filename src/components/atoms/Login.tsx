import React from 'react'
import { Account, Web3Provider } from '@rsksmart/rif-ui'

const Login = () => (
  <Web3Provider.Consumer>
    {({ state: { web3, networkName, account }, actions: { setProvider } }) => (
      <Account
        web3={web3}
        networkName={networkName}
        account={account}
        setProvider={setProvider}
      />
    )}
  </Web3Provider.Consumer>
)

export default Login
