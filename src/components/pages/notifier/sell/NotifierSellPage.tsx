import Typography from '@material-ui/core/Typography'
import { Web3Store } from '@rsksmart/rif-ui'
import InfoBar from 'components/molecules/InfoBar'
import NoWhitelistedProvider from 'components/molecules/NoWhitelistedProvider'
import ProviderEdition from 'components/organisms/notifier/provider/ProviderEdition'
import Staking from 'components/organisms/notifier/Staking'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import NotifierContract from 'contracts/notifier/Notifier'
import useConfirmations from 'hooks/useConfirmations'
import useErrorReporter from 'hooks/useErrorReporter'
import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import Web3 from 'web3'
import AppContext from 'context/App'
import { NotifierOffersService } from 'api/rif-marketplace-cache/notifier'
import WithLoginCard from 'components/hoc/WithLoginCard'

const NotifierSellPage: FC = () => {
  const {
    state: {
      web3,
      account,
    },
  } = useContext(Web3Store)
  const { state: { apis } } = useContext(AppContext)
  const hasPendingConfs = Boolean(useConfirmations(
    ['NOTIFIER_REGISTER_PROVIDER'],
  ).length)
  const reportError = useErrorReporter()

  const [isCheckingWhitelist, setIsCheckingWhitelist] = useState(true)
  const [isWhitelistedProvider, setIsWhitelistedProvider] = useState(false)
  const accountStr = account as string // wrapped with login card
  const [isLoadingOffer, setIsLoadingOffer] = useState(false)
  const [hasOffer, setHasOffer] = useState(false)

  useEffect(() => {
    const getOwnOffers = async (): Promise<void> => {
      setIsLoadingOffer(true)

      const offersService = apis['notifier/v0/offers'] as NotifierOffersService
      offersService.connect(reportError)

      const currentOwnOffers = await offersService.fetch({
        provider: account,
      })
      setHasOffer(Boolean(currentOwnOffers[0]))
      setIsLoadingOffer(false)
    }

    getOwnOffers()
  }, [apis, account, reportError])

  useEffect(() => {
    const checkWhitelisted = async (): Promise<void> => {
      try {
        setIsCheckingWhitelist(true)
        const notifierContract = NotifierContract.getInstance(web3 as Web3)
        const isWhitelisted = Boolean(await notifierContract
          .isWhitelistedProvider(accountStr))

        setIsWhitelistedProvider(isWhitelisted)
      } catch (error) {
        reportError({
          error,
          id: 'contract-notifier',
          text: 'Could not determine if the account is whitelisted.',
        })
      } finally {
        setIsCheckingWhitelist(false)
      }
    }

    checkWhitelisted()
  }, [accountStr, web3, reportError])

  if (hasOffer) {
    return (
      <CenteredPageTemplate>
        <h1>Multiple offers is not supported yet! Please, edit your</h1>
        <p>Please, consider editing your offer here</p>
      </CenteredPageTemplate>
    )
  }

  return (
    <CenteredPageTemplate>
      <InfoBar
        isVisible={Boolean(hasPendingConfs)}
        text="Awaiting confirmations for provider registration"
        type="info"
      />
      {
        !isCheckingWhitelist
        && !isWhitelistedProvider
        && <NoWhitelistedProvider service="Notifier" />
      }
      <Staking isEnabled={isWhitelistedProvider} />
      <Typography gutterBottom variant="h5" color="primary">
        Register as notifications provider
      </Typography>
      <Typography gutterBottom color="secondary" variant="subtitle1">
        Fill out the fields below to list your notification service. All the information provided is meant to be true and correct.
      </Typography>
      <ProviderEdition isLoading={isLoadingOffer || hasPendingConfs} />
    </CenteredPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: NotifierSellPage,
  title: 'Connect your wallet to register as a provider',
  contentText: 'Please, connect your wallet in order to register as a provider.',
})
