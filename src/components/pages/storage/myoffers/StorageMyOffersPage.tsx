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

const logger = Logger.getInstance()

const useStyles = makeStyles((theme: Theme) => ({
  resultsContainer: {
    marginTop: theme.spacing(2),
  },
  // TODO: extract reusable component with the container
  txInProgressContainer: {
    background: 'rgba(275, 275, 275, 0.8)',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
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
  const { dispatch: bcDispatch } = useContext(BlockchainContext)
  const reportError = useCallback((e: UIError) => errorReporterFactory(appDispatch)(e), [appDispatch])

  const [isPendingConfirm, setIsPendingConfirm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    dispatch({
      type: 'CLEAN_UP',
      payload: {},
    })

    // TODO: handle no account - create a reusable HOC?
    if (account) {
      dispatch({
        type: 'FILTER',
        payload: { name: account },
      })
    }
  }, [account, dispatch])

  useEffect(() => {
    if (isPendingConfirm && !isProcessing) {
      // Post-confirmations handle
      // TODO: create new route and page for my offers cancel
      history.replace(ROUTES.STORAGE.MYOFFERS.BASE)
    }
  }, [isPendingConfirm, history, isProcessing])

  const onProcessingComplete = () => {
    setIsProcessing(false)
  }

  const handleOfferCancel = async () => {
    // without web3 or account, the user wouldn't be able to perform this action
    if (!web3 || !account) return

    try {
      appDispatch({
        type: 'SET_IS_LOADING',
        payload: {
          isLoading: true,
          id: 'contract',
          message: 'Cancelling your offer...',
        } as LoadingPayload,
      } as any)

      setIsProcessing(true)

      const storageContract = StorageContract.getInstance(web3)
      const terminateOfferRecepipt = await storageContract.terminateOffer({ from: account })

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
        id: 'contract-storage-set-offer',
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
      } as any)
    }
  }

  // TODO: handle edit offer
  const handleEditOffer = (offerId: string) => logger.debug(`todo: handle edit offer ${offerId}`)

  return (
    <CenteredPageTemplate>
      <StakingCard
        balance="2048 RIF"
        onAddFunds={() => logger.info('Add funds clicked')}
        onWithdrawFunds={() => logger.info('withdraw funds clicked')}
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
      {/* TODO: create generic component to show when no account */}
      {
        !!account
        && (
          <OffersList
            items={items}
            isLoading={isLoadingItems}
            onCancelOffer={handleOfferCancel}
            onEditOffer={handleEditOffer}
          />
        )
      }
      {
        !account && (
          <Grid container>
            <Typography color="secondary">Please, connect your wallet to see your offers</Typography>
          </Grid>
        )
      }
      {
        isProcessing
        && (
          <div className={classes.txInProgressContainer}>
            <TransactionInProgressPanel
              {...{ isPendingConfirm, onProcessingComplete }}
              text="Cancelling your offer"
              progMsg="The waiting period is required to securely cancel your offer.
             Please do not close this tab until the process has finished."
            />
          </div>
        )
      }
    </CenteredPageTemplate>
  )
}

export default StorageMyOffersPage
