import { Web3Store } from '@rsksmart/rif-ui'
import RoundBtn from 'components/atoms/RoundBtn'
import InfoBar from 'components/molecules/InfoBar'
import EditProvider from 'components/organisms/notifier/provider/EditProvider'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import { ConfirmationsContext } from 'context/Confirmations'
import NotifierContract from 'contracts/notifier/Notifier'
import useConfirmations from 'hooks/useConfirmations'
import useErrorReporter from 'hooks/useErrorReporter'
import React, { FC, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import Web3 from 'web3'

const NotifierEditOfferPage: FC = () => {
  const {
    state: {
      web3,
      account,
    },
  } = useContext(Web3Store)
  const { dispatch: confirmationsDispatch } = useContext(ConfirmationsContext)
  const reportError = useErrorReporter()
  const history = useHistory()
  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)
  const accountStr = account as string
  const hasPendingConfs = useConfirmations(
    ['NOTIFIER_REGISTER_PROVIDER'],
  ).length

  if (!account) {
    history.push(ROUTES.NOTIFIER.BASE)
    return null
  }

  // TODO: check if it's possible to move to ProviderRegistrar - this is the common method between edit and create
  // .ito
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

  return (
    <CenteredPageTemplate>
      <InfoBar
        isVisible={Boolean(hasPendingConfs)}
        text="Awaiting confirmations for provider registration"
        type="info"
      />
      <EditProvider
        accountStr={accountStr}
        onRegister={handleRegistration}
      >
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
    </CenteredPageTemplate>
  )
}

export default NotifierEditOfferPage
