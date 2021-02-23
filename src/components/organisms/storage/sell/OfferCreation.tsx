import React, {
  useContext, useCallback, useState, useEffect, FC,
} from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button as RUIButton, Web3Store, WithSpinner } from '@rsksmart/rif-ui'
import Typography from '@material-ui/core/Typography'
import OfferEditContext from 'context/Market/storage/Context'
import { StorageContract } from 'contracts/storage'
import Logger from 'utils/Logger'
import { UIError } from 'models/UIMessage'
import Login from 'components/atoms/Login'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import Big from 'big.js'
import AppContext, { errorReporterFactory } from 'context/App'
import EditOfferStepper from 'components/organisms/storage/sell/EditOfferStepper'
import RoundedCard from 'components/atoms/RoundedCard'
import { transformOfferDataForContract } from 'contracts/storage/utils'
import { StorageGlobalContext, StorageGlobalContextProps } from 'context/Services/storage'
import NoWhitelistedProvider from 'components/molecules/storage/NoWhitelistedProvider'
import { StorageOffersService } from 'api/rif-marketplace-cache/storage/offers'
import { StorageOffer } from 'models/marketItems/StorageItem'
import { OfferEditContextProps } from 'context/Market/storage'
import Web3 from 'web3'
import { ConfirmationsContext, ConfirmationsContextProps } from 'context/Confirmations'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import RoundBtn from 'components/atoms/RoundBtn'

// TODO: discuss about wrapping the library and export it with this change
Big.NE = -30

const logger = Logger.getInstance()

const useStyles = makeStyles((theme: Theme) => ({
  staking: {
    marginBottom: theme.spacing(2),
  },
  stepperContainer: {
    margin: theme.spacing(3, 0),
    width: '100%',
  },
}))

const OfferCreation: FC = () => {
  const {
    state: {
      billingPlans, totalCapacity, peerId, system,
    },
    dispatch,
  } = useContext<OfferEditContextProps>(OfferEditContext)

  const {
    state: {
      account,
      web3,
    },
  } = useContext(Web3Store)

  const { state: appState, dispatch: appDispatch } = useContext(AppContext)
  const reportError = useCallback((
    e: UIError,
  ) => errorReporterFactory(appDispatch)(e), [appDispatch])
  const {
    state: { isWhitelistedProvider },
  } = useContext<StorageGlobalContextProps>(StorageGlobalContext)
  const {
    dispatch: confirmationsDispatch,
  } = useContext<ConfirmationsContextProps>(ConfirmationsContext)

  const [isTxDone, setIsTxDone] = useState(false)
  const [isTxInProgress, setIsTxInProgress] = useState(false)

  const classes = useStyles()
  const history = useHistory()

  const handleSubmit = async (): Promise<void> => {
    try {
      setIsTxInProgress(true)
      const storageOffersService = appState?.apis?.['storage/v0/offers'] as StorageOffersService
      storageOffersService.connect(errorReporterFactory(appDispatch))

      const currentOwnOffers = await storageOffersService.fetch({
        withInactive: true,
        provider: account,
      }) as StorageOffer[]

      const storageContract = StorageContract.getInstance(web3 as Web3)
      const {
        totalCapacityMB, periods, prices, tokens,
      } = transformOfferDataForContract(
        totalCapacity, billingPlans, currentOwnOffers[0]?.subscriptionOptions,
      )

      const setOfferReceipt = await storageContract.setOffer(
        totalCapacityMB,
        periods,
        prices,
        tokens,
        peerId,
        { from: account },
      )
      logger.debug('setOffer receipt: ', setOfferReceipt)

      if (setOfferReceipt) {
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'NEW_OFFER',
            txHash: setOfferReceipt.transactionHash,
          },
        })
        setIsTxDone(true)
      }
    } catch (error) {
      reportError(new UIError({
        error,
        id: 'contract-storage',
        text: 'Could not set the offer in the contract.',
      }))
    } finally {
      setIsTxInProgress(false)
    }
  }

  const onProcessingComplete = (): void => {
    history.push(ROUTES.STORAGE.MYOFFERS.BASE)
  }

  useEffect(() => (): void => {
    dispatch({
      type: 'CLEAN_UP',
    })
  }, [dispatch])

  const isSubmitEnabled = billingPlans.length &&
    Number(totalCapacity) &&
    system &&
    peerId &&
    isWhitelistedProvider

  const endHandler = account
    ? (
      <>
        <RUIButton
          onClick={handleSubmit}
          disabled={!isSubmitEnabled}
          color="primary"
          rounded
          variant="contained"
        >
          List storage
        </RUIButton>
        {
          Boolean(isSubmitEnabled) &&
          (
            <Typography
              gutterBottom
              color="secondary"
              variant="subtitle1"
              align="center"
            >
              {`Your wallet will open and you will be asked
               to confirm the transaction for listing your service.`}
            </Typography>
          )
        }
      </>
    )
    : <Login />

  return (
    <>
      <Typography gutterBottom variant="h5" color="primary">
        List your storage service
      </Typography>
      <Typography gutterBottom color="secondary" variant="subtitle1">
        {`Fill out the fields below to list your storage service. 
        All the information provided is meant to be true and correct.`}
      </Typography>
      {
        Boolean(account) &&
        isWhitelistedProvider === false && // we don't want to show the message on undefined
        <NoWhitelistedProvider />
      }
      <RoundedCard color="primary" className={classes.stepperContainer}>
        <EditOfferStepper isLoading={false} endHandler={endHandler} />
      </RoundedCard>
      <ProgressOverlay
        inProgress={isTxInProgress}
        isDone={isTxDone}
        buttons={[
        <RoundBtn
          onClick={onProcessingComplete}
          key="prog-offer"
        >See your offer</RoundBtn>
]
        }
        doneMsg="Your offer has been listed!"
        title="Listing your offer"
      />
    </>
  )
}

export default WithSpinner(OfferCreation)
