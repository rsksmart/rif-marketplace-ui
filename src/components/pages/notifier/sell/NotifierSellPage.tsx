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

  const [isWhitelistedProvider, setIsWhitelistedProvider] = useState(false)
  const [isCheckingWhitelist, setIsCheckingWhitelist] = useState(true)

  useEffect(() => {
    const checkWhitelisted = async (): Promise<void> => {
      try {
        setIsCheckingWhitelist(true)
        const notifierContract = NotifierContract.getInstance(web3 as Web3)
        const isWhitelisted = Boolean(await notifierContract
          .isWhitelistedProvider(account as string))

        setIsWhitelistedProvider(isWhitelisted)
      } catch (error) {
        // TODO: report new UI error
        logger.error('Could not determine if the account is a whitelisted provider.')
      } finally {
        setIsCheckingWhitelist(false)
      }
    }

    checkWhitelisted()
  }, [account, web3])

  const handleRegistration = ({ endpointUrl, providerAddress }): void => {
    logger.debug({ endpointUrl })
    logger.debug({ providerAddress })
    // TODO: interact with the SC
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
        isEnabled={isWhitelistedProvider}
        onRegister={handleRegistration}
      />
    </CenteredPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: NotifierSellPage,
  title: 'Connect your wallet to register as a provider',
  contentText: 'Please, connect your wallet in order to register as a provider.',
})
