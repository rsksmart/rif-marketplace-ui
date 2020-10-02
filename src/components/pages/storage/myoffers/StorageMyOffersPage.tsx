import React, {
  FC, useCallback, useContext, useEffect, useState,
} from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import handProvidingFunds from 'assets/images/handProvidingFunds.svg'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import StakingCard from 'components/organisms/storage/myoffers/StakingCard'
import Logger from 'utils/Logger'
import { Web3Store } from '@rsksmart/rif-ui'
import StorageOffersContext, { StorageOffersContextProps } from 'context/Services/storage/OffersContext'
import OffersList from 'components/organisms/storage/myoffers/OffersList'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import StorageContract from 'contracts/Storage'
import BlockchainContext from 'context/Blockchain/BlockchainContext'
import { AddTxPayload } from 'context/Blockchain/blockchainActions'
import TransactionInProgressPanel from 'components/organisms/TransactionInProgressPanel'
import ROUTES from 'routes'
import { useHistory } from 'react-router-dom'
import { LoadingPayload } from 'context/App/appActions'
import { UIError } from 'models/UIMessage'
import WithLoginCard from 'components/hoc/WithLoginCard'
import OfferEditContext from 'context/Market/storage/OfferEditContext'
import { OfferEditContextProps } from 'context/Market/storage/interfaces'
import { SetOfferPayload } from 'context/Market/storage/offerEditActions'
import { StorageOffer } from 'models/marketItems/StorageItem'

const logger = Logger.getInstance()

const useStyles = makeStyles((theme: Theme) => ({
  resultsContainer: {
    marginTop: theme.spacing(2),
  },
}))

const StorageMyOffersPage: FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const {
    state: { account, web3 },
  } = useContext(Web3Store)
  const {
    state: {
      loaders: { data: isLoadingItems },
    },
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const {
    state: {
      listing: { items },
    },
    dispatch,
  } = useContext<StorageOffersContextProps>(StorageOffersContext)
  const {
    dispatch: editOfferDispatch,
  } = useContext<OfferEditContextProps>(OfferEditContext)
  const { dispatch: bcDispatch } = useContext(BlockchainContext)
  const reportError = useCallback((
    e: UIError,
  ) => errorReporterFactory(appDispatch)(e), [appDispatch])

  const [isPendingConfirm, setIsPendingConfirm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    dispatch({
      type: 'CLEAN_UP',
      payload: {},
    })

    if (account) {
      dispatch({
        type: 'FILTER',
        payload: { provider: account },
      })
    }
  }, [account, dispatch])

  useEffect(() => {
    if (isPendingConfirm && !isProcessing) { // Post-confirmations handle
      history.replace(ROUTES.STORAGE.MYOFFERS.CANCEL.DONE)
    }
  }, [isPendingConfirm, history, isProcessing])

  const onProcessingComplete = (): void => {
    setIsProcessing(false)
  }

  const handleOfferCancel = async (): Promise<void> => {
    // without web3 or account, the user wouldn't be able to perform this action
    if (!web3 || !account) return

    try {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'contract',
          message: 'canceling your offer...',
        } as LoadingPayload,
      })

      setIsProcessing(true)

      const storageContract = StorageContract.getInstance(web3)
      const terminateOfferRecepipt = await storageContract
        .terminateOffer({ from: account })

      bcDispatch({
        type: 'SET_TX_HASH',
        payload: {
          txHash: terminateOfferRecepipt.transactionHash,
        } as AddTxPayload,
      })

      setIsPendingConfirm(true)
    } catch (error) {
      reportError(new UIError({
        error,
        id: 'contract-storage',
        text: 'Could not set the offer in the contract.',
      }))
      setIsProcessing(false)
    } finally {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: false,
          id: 'contract',
        } as LoadingPayload,
      })
    }
  }

  const handleEditOffer = (offer: StorageOffer) => {
    // const {
    //   availableSizeGB, location, peerId, system, subscriptionOptions, id,
    // } = offer

    // const payload = {
    //   availableSize: Number(availableSizeGB),
    //   country: location,
    //   peerId,
    //   system,
    //   billingPlans: subscriptionOptions,
    //   offerId: id,
    // } as SetOfferPayload

    editOfferDispatch({
      type: 'SET_OFFER',
      payload: offer as SetOfferPayload,
    })
    history.push(ROUTES.STORAGE.MYOFFERS.EDIT.BASE)
  }

  return (
    <CenteredPageTemplate>
      <StakingCard
        balance="2048 RIF"
        onAddFunds={(): void => logger.info('Add funds clicked')}
        onWithdrawFunds={(): void => logger.info('withdraw funds clicked')}
      />
      <Grid
        container
        alignItems="center"
        className={classes.resultsContainer}
      >
        <Grid item xs="auto">
          <img src={handProvidingFunds} alt="hand providing funds" />
        </Grid>
        <Grid item xs={10} md="auto">
          <Typography gutterBottom variant="h5" color="primary">
            You are providing the following storage space to your customers
          </Typography>
        </Grid>
      </Grid>
      <OffersList
        items={items}
        isLoading={isLoadingItems}
        onCancelOffer={handleOfferCancel}
        onEditOffer={handleEditOffer}
      />
      {
        isProcessing
        && (
          <TransactionInProgressPanel
            {...{ isPendingConfirm, onProcessingComplete }}
            text="Canceling your offer"
            progMsg="The waiting period is required to securely cancel your offer.
             Please do not close this tab until the process has finished."
            overlayed
          />
        )
      }
    </CenteredPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: StorageMyOffersPage,
  title: 'Connect your wallet to see your offers',
  contentText: 'Connect your wallet to get detailed information about your offers',
})
