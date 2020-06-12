import React, { useState } from 'react'
import { Account, Web3Provider } from '@rsksmart/rif-ui'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import { Alert } from '@material-ui/lab'

const requiredNetworkId = process.env.REQUIRED_NETWORK || 31

const Login = () => {

  const history = useHistory()
  const [displayAlert, setDisplayAlert] = useState(false)

  return (
    <>
      {displayAlert && <Alert severity='warning' onClose={() => setDisplayAlert(false)}>Your account has changed</Alert>}
      <Web3Provider.Consumer>
        {({ state: { web3, account, networkInfo }, actions: { setProvider, registerOnAccountsChange } }) => (
          <>
            {
              registerOnAccountsChange(() => {
                setDisplayAlert(true)
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
    </>
  )
}

export default Login
