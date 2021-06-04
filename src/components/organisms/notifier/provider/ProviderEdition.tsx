import React, { FC, useContext, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import RoundBtn from 'components/atoms/RoundBtn'
import { Grid } from '@material-ui/core'
import { ModalDialogue, Web3Store, WithSpinner } from '@rsksmart/rif-ui'
import NotifierContract from 'contracts/notifier/Notifier'
import Web3 from 'web3'
import { ConfirmationsContext } from 'context/Confirmations'
import { useHistory } from 'react-router-dom'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import ROUTES from 'routes'
import useErrorReporter from 'hooks/useErrorReporter'
import ProviderRegistrarForm from './ProviderRegistrarForm'

type Props = {
  editMode?: boolean
}

type LabelTypes = 'BUTTON_LABEL' | 'INPROGRESS_MESSAGE' | 'DONE_MESSAGE'
const editLabels: Record<LabelTypes, string> = {
  BUTTON_LABEL: 'Edit Offer',
  INPROGRESS_MESSAGE: 'Editing your provider info!',
  DONE_MESSAGE: 'Your provider info has been updated!',
}

const createLabels: Record<LabelTypes, string> = {
  BUTTON_LABEL: 'Register Provider',
  INPROGRESS_MESSAGE: 'Registering as a provider!',
  DONE_MESSAGE: 'You have been registered as a provider!',
}

const ProviderEdition: FC<Props> = (
  { editMode },
) => {
  const {
    state: {
      web3,
      account,
    },
  } = useContext(Web3Store)
  const accountStr = account as string // not able to access here w/o acc
  const { dispatch: confirmationsDispatch } = useContext(ConfirmationsContext)
  const history = useHistory()
  const reportError = useErrorReporter()

  const [showConfirmProviderEdit, setShowConfirmProviderEdit] = useState(false)
  const [providerUrl, setProviderUrl] = useState('')
  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)

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
    } finally {
      setProcessingTx(false)
    }
  }

  const handleRegistration = (url: string): void => {
    if (editMode) {
      setProviderUrl(url)
      setShowConfirmProviderEdit(true) // this opens a dialog that ends up calling onRegister(providerUrl)
    } else {
      onRegister(url)
    }
  }

  const labels = editMode ? editLabels : createLabels
  const buttonLabel = labels.BUTTON_LABEL
  const txDoneMsg = labels.DONE_MESSAGE
  const txInProgressTitle = labels.INPROGRESS_MESSAGE

  return (
    <>
      <ModalDialogue
        title="Confirm Provider Update"
        open={showConfirmProviderEdit}
        onClose={(): void => { setShowConfirmProviderEdit(false) }}
      >
        <Grid
          container
          spacing={2}
          wrap="nowrap"
          direction="column"
          alignItems="center"
        >
          <Box p={3}>
            <Typography
              gutterBottom
              color="error"
              align="center"
            >
              Your existing subscriptions and plans will be affected
            </Typography>
            <Typography gutterBottom color="secondary">
              As a result of this operation, if the new url contains a different set of subscription plans than the current set of plans in marketplace, the current marketplace plans will be set to inactive, and any subscriptions that belong to those plans will be affected.
            </Typography>
          </Box>
          <Box>
            <RoundBtn onClick={(): Promise<void> => onRegister(providerUrl)}>
              Confirm
            </RoundBtn>
          </Box>
        </Grid>
      </ModalDialogue>
      <ProviderRegistrarForm
        providerAddress={accountStr}
        isEnabled
        onRegister={({ endpointUrl }): void => handleRegistration(endpointUrl)}
        buttonLabel={buttonLabel}
      />
      <ProgressOverlay
        title={txInProgressTitle}
        doneMsg={txDoneMsg}
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
    </>
  )
}

export default WithSpinner(ProviderEdition)
