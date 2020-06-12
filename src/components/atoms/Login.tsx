import React from 'react'
import { Account, Web3Provider } from '@rsksmart/rif-ui'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'

const requiredNetworkId = process.env.REQUIRED_NETWORK || 31

const Login = () => {

  const history = useHistory()
  return (
    <Web3Provider.Consumer>
      {({ state: { web3, account, networkInfo }, actions: { setProvider, registerOnAccountsChange } }) => (
        <>
          {
            registerOnAccountsChange(() => {
              history.push(ROUTES.LANDING)
            })
          }
          <Account
            web3={web3}
            account={account}
            setProvider={setProvider}
            requiredNetwork={requiredNetworkId}
            currentNetwork={networkInfo?.networkId}
          />
        </>
      )}
    </Web3Provider.Consumer>
  )
}

export default Login
