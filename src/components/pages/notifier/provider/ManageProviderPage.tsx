import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import NotifierContract from 'contracts/notifier/Notifier'
import { Web3Store } from '@rsksmart/rif-ui'
import Web3 from 'web3'
import NoWhitelistedProvider
  from 'components/molecules/NoWhitelistedProvider'
import { ConfirmationsContext } from 'context/Confirmations'
import InfoBar from 'components/molecules/InfoBar'
import useConfirmations from 'hooks/useConfirmations'
import useErrorReporter from 'hooks/useErrorReporter'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import RoundBtn from 'components/atoms/RoundBtn'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import AddProvider from 'components/organisms/notifier/provider/AddProvider'
import EditProvider from 'components/organisms/notifier/provider/EditProvider'

type Props = {
  create: boolean
}

const ManageProviderPage: FC<Props> = ({ create }) => {
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

  const accountStr = account as string // wrapped withLoginCard
  const [isCheckingWhitelist, setIsCheckingWhitelist] = useState(true)
  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)
  const [isWhitelistedProvider, setIsWhitelistedProvider] = useState(false)

  const handleRegistration = async (url: string): Promise<void> => {
    try {
      setProcessingTx(true)
      const notifierContract = NotifierContract.getInstance(web3 as Web3)
      const registerReceipt = await notifierContract.registerProvider(
        url, { from: accountStr },
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
      {
        create
          ? (
            <AddProvider isWhitelistedProvider={isWhitelistedProvider} accountStr={accountStr} onRegister={handleRegistration}>
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

            </AddProvider>
          )
          : (
            <EditProvider isWhitelistedProvider={isWhitelistedProvider} accountStr={accountStr} onRegister={handleRegistration}>
              <ProgressOverlay
                title="Editing your provider info!"
                doneMsg="You provider info has been updated!"
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
            </EditProvider>

          )
      }
    </CenteredPageTemplate>
  )
}

export default ManageProviderPage
