import Typography from '@material-ui/core/Typography'
import ProviderRegistrar from 'components/organisms/notifier/ProviderRegistrar'
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
import RifDialog from 'components/organisms/RifDialog'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Staking from 'components/organisms/notifier/Staking'

export type Props = {
  mode: 'EDIT' | 'CREATE'
}

const ProviderEdit: FC<Props> = ({ mode }) => {
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
  const [isWhitelistedProvider, setIsWhitelistedProvider] = useState(false)
  const [isCheckingWhitelist, setIsCheckingWhitelist] = useState(true)
  const [processingTx, setProcessingTx] = useState(false)
  const [txOperationDone, setTxOperationDone] = useState(false)
  const [showConfirmProviderEdit, setShowConfirmProviderEdit] = useState(false)
  const [providerUrl, setProviderUrl] = useState<string>('')

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

  const handleRegistration = async ({ endpointUrl }): Promise<void> => {
    try {
      setProcessingTx(true)
      const notifierContract = NotifierContract.getInstance(web3 as Web3)
      const registerReceipt = await notifierContract.registerProvider(
        endpointUrl, { from: accountStr },
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

  const confirmRegistration = async (): Promise<void> => {
    await handleRegistration({ endpointUrl: providerUrl })
  }

  return (
    <CenteredPageTemplate>
      <InfoBar
        isVisible={Boolean(hasPendingConfs)}
        text="Awaiting confirmations for new offer"
        type="info"
      />
      {mode === 'CREATE' ? <Staking isEnabled={isWhitelistedProvider} />
        : (
          <RifDialog
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
              <Box pt={4}>
                <Typography gutterBottom variant="h5" color="primary">
                  Confirm Provider Update
                </Typography>
              </Box>
              <Box pt={8} pl={3} pr={3}>
                <Typography gutterBottom color="error">Your existing subscriptions and plans will be affected</Typography>
                <Typography gutterBottom color="secondary">
                  As a result of this operation, if the new url contains a different set of subscription plans than the current set of plans in marketplace, the current marketplace plans will be set to inactive, and any subscriptions that belong to those plans will be affected.
                </Typography>
              </Box>
              <Box pt={4}>
                <RoundBtn onClick={confirmRegistration}>Confirm</RoundBtn>
              </Box>

            </Grid>
          </RifDialog>
        ) }
      <Typography gutterBottom variant="h5" color="primary">
        {mode === 'EDIT' ? 'Edit your information as provider' : 'Register as notifications provider'}
      </Typography>
      <Typography gutterBottom color="secondary" variant="subtitle1">
        {mode === 'EDIT' ? 'Fill out the fields below to edit your trigger offer.' : 'Fill out the fields below to list your notification service.'}
        All the information provided is meant to be true and correct.
      </Typography>
      {
        !isCheckingWhitelist
        && !isWhitelistedProvider
        && <NoWhitelistedProvider service="Notifier" />
      }
      {mode === 'EDIT'
        ? (
          <ProviderRegistrar
            providerAddress={accountStr}
            isEnabled={isWhitelistedProvider}
            onRegister={({ endpointUrl }): void => {
              setShowConfirmProviderEdit(true)
              setProviderUrl(endpointUrl)
            }}
            buttonLabel="Edit Offer"
          />
        )
        : (
          <ProviderRegistrar
            providerAddress={accountStr}
            isEnabled={isWhitelistedProvider}
            onRegister={handleRegistration}
          />
        )}
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

export default ProviderEdit
