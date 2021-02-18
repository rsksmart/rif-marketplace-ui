import Typography from '@material-ui/core/Typography'
import ProviderRegistrar from 'components/organisms/notifier/ProviderRegistrar'
import WithLoginCard from 'components/hoc/WithLoginCard'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import Logger from 'utils/Logger'
import Staking from 'components/organisms/notifier/Staking'
import NotifierContract from 'contracts/notifier/Notifier'
import { Web3Store } from '@rsksmart/rif-ui'
import Web3 from 'web3'
import NoWhitelistedProvider from 'components/molecules/storage/NoWhitelistedProvider'

const logger = Logger.getInstance()

const NotifierSellPage: FC = () => {
  const {
    state: {
      web3,
      account,
    },
  } = useContext(Web3Store)
  const accountStr = account as string // this component is wrapped withLoginCard

  const [isWhitelistedProvider, setIsWhitelistedProvider] = useState(false)
  const [isCheckingWhitelist, setIsCheckingWhitelist] = useState(true)

  useEffect(() => {
    const checkWhitelisted = async (): Promise<void> => {
      try {
        setIsCheckingWhitelist(true)
        const notifierContract = NotifierContract.getInstance(web3 as Web3)
        const isWhitelisted = Boolean(await notifierContract
          .isWhitelistedProvider(accountStr))

        setIsWhitelistedProvider(isWhitelisted)
      } catch (error) {
        // TODO: report new UI error
        logger.error('Could not determine if the account is a whitelisted provider.')
      } finally {
        setIsCheckingWhitelist(false)
      }
    }

    checkWhitelisted()
  }, [accountStr, web3])

  const handleRegistration = async ({ endpointUrl }): Promise<void> => {
    const notifierContract = NotifierContract.getInstance(web3 as Web3)
    const registerReceipt = await notifierContract.registerProvider(
      endpointUrl, { from: accountStr },
    )
    logger.debug(registerReceipt)
    // TODO: handle confirmations and tx in progress
  }

  return (
    <CenteredPageTemplate>
      <Staking isEnabled={isWhitelistedProvider} />
      <Typography gutterBottom variant="h5" color="primary">
        Register as notifications provider
      </Typography>
      <Typography gutterBottom color="secondary" variant="subtitle1">
        {`Fill out the fields below to list your notification service. 
        All the information provided is meant to be true and correct.`}
      </Typography>
      {
        !isCheckingWhitelist
        && !isWhitelistedProvider
        && <NoWhitelistedProvider service="Notifications" />
      }
      <ProviderRegistrar
        providerAddress={accountStr}
        isEnabled={isWhitelistedProvider}
        onRegister={handleRegistration}
      />
    </CenteredPageTemplate>
  )
}

// if this wrapper is removed, the account could be undefined
// and the account handler should change
export default WithLoginCard({
  WrappedComponent: NotifierSellPage,
  title: 'Connect your wallet to register as a provider',
  contentText: 'Please, connect your wallet in order to register as a provider.',
})
