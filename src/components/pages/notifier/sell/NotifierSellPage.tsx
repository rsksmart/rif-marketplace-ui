import { Typography } from '@material-ui/core'
import { Web3Store } from '@rsksmart/rif-ui'
import RoundBtn from 'components/atoms/RoundBtn'
import WithLoginCard from 'components/hoc/WithLoginCard'
import InfoBar from 'components/molecules/InfoBar'
import NoWhitelistedProvider from 'components/molecules/NoWhitelistedProvider'
import ProviderRegistrar from 'components/organisms/notifier/ProviderRegistrar'
import Staking from 'components/organisms/notifier/Staking'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import { ConfirmationsContext } from 'context/Confirmations'
import NotifierContract from 'contracts/notifier/Notifier'
import useConfirmations from 'hooks/useConfirmations'
import useErrorReporter from 'hooks/useErrorReporter'
import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import Web3 from 'web3'

const NotifierSellPage: FC = () => {
  const {
    state: {
      web3,
      account,
    },
  } = useContext(Web3Store)
  const { dispatch: confirmationsDispatch } = useContext(ConfirmationsContext)
  const hasPendingConfs = Boolean(useConfirmations(
    ['NOTIFIER_REGISTER_PROVIDER'],
  ).length)
  const reportError = useErrorReporter()
  const history = useHistory()

  const [isCheckingWhitelist, setIsCheckingWhitelist] = useState(true)
  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)
  const [isWhitelistedProvider, setIsWhitelistedProvider] = useState(false)
  const accountStr = account as string // wrapped with login card

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

  const onRegister = async (url: string): Promise<void> => {
    try {
      setProcessingTx(true)
      const notifierContract = NotifierContract.getInstance(web3 as Web3)
      const registerReceipt = await notifierContract.registerProvider(
        url, { from: account },
      )

      if (registerReceipt) {
        setTxOperationDone(true)
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'NOTIFIER_REGISTER_PROVIDER',
            txHash: registerReceipt.transactionHash,
          },
        })
      }
    } catch (error) {
      reportError({
        error,
        id: 'contract-notifier',
        text: 'Could not register as a provider',
      })
    }
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
      <ProviderRegistrar
        providerAddress={accountStr}
        isEnabled={isWhitelistedProvider}
        onRegister={({ endpointUrl }): void => {
          onRegister(endpointUrl)
        }}
      />
      <ProgressOverlay
        title="Registering as a provider!"
        doneMsg="You have been registered as a provider!"
        inProgress={processingTx}
        isDone={txOperationDone}
        buttons={[
          <RoundBtn
            key="go_to_my_offers"
            onClick={
              (): void => history.push(ROUTES.NOTIFIER.MYOFFERS.BASE)
            }
          >
            View my offers
          </RoundBtn>,
          <RoundBtn
            key="go_to_list"
            onClick={
              (): void => history.push(ROUTES.NOTIFIER.BUY.BASE)
            }
          >
            View offers listing
          </RoundBtn>,
        ]}
      />
    </CenteredPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: NotifierSellPage,
  title: 'Connect your wallet to register as a provider',
  contentText: 'Please, connect your wallet in order to register as a provider.',
})
