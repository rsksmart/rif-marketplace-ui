import React, {
  FC, useCallback, useContext, useEffect, useState,
} from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Web3Store } from '@rsksmart/rif-ui'
import handProvidingFunds from 'assets/images/handProvidingFunds.svg'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import OffersList from 'components/organisms/storage/myoffers/OffersList'
import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { StorageContract } from 'contracts/storage'
import ROUTES from 'routes'
import { useHistory } from 'react-router-dom'
import { UIError } from 'models/UIMessage'
import WithLoginCard from 'components/hoc/WithLoginCard'
import OfferEditContext from 'context/Market/storage/OfferEditContext'
import { OfferEditContextProps } from 'context/Market/storage/interfaces'
import { SetOfferPayload } from 'context/Market/storage/offerEditActions'
import { StorageOffer } from 'models/marketItems/StorageItem'
import Staking from 'components/organisms/storage/staking/Staking'
import { StorageOffersService } from 'api/rif-marketplace-cache/storage/offers'
import Web3 from 'web3'
import { ConfirmationsContext, ConfirmationsContextProps } from 'context/Confirmations'
import InfoBar from 'components/molecules/InfoBar'
import ProgressOverlay from 'components/templates/ProgressOverlay'
import RoundBtn from 'components/atoms/RoundBtn'
import useConfirmations from 'hooks/useConfirmations'

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
    state: appState,
    dispatch: appDispatch,
  } = useContext<AppContextProps>(AppContext)
  const {
    dispatch: editOfferDispatch,
  } = useContext<OfferEditContextProps>(OfferEditContext)
  const reportError = useCallback((
    e: UIError,
  ) => errorReporterFactory(appDispatch)(e), [appDispatch])

  const {
    dispatch: confirmationsDispatch,
  } = useContext<ConfirmationsContextProps>(ConfirmationsContext)

  const [txIsInProgress, setTxIsInProgress] = useState(false)
  const [txIsDone, setTxIsDone] = useState(false)
  const [items, setItems] = useState<StorageOffer[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  const numberOfConfs = useConfirmations(
    ['CANCEL_OFFER', 'NEW_OFFER', 'EDIT_OFFER'],
  ).length
  const isProcessingConfs = Boolean(numberOfConfs)

  // fetch own offers
  useEffect(() => {
    const getOwnOffers = async (): Promise<void> => {
      const storageOffersService = appState?.apis?.['storage/v0/offers'] as StorageOffersService
      storageOffersService.connect(errorReporterFactory(appDispatch))

      const currentOwnOffers = await storageOffersService.fetch({
        withInactive: true,
        provider: account,
      }) as StorageOffer[]

      setItems(currentOwnOffers)
      setIsLoadingData(false)
    }

    if (!isProcessingConfs) {
      getOwnOffers()
    }
  }, [account, appDispatch, appState, isProcessingConfs])

  const handleTxCompletedClose = (): void => {
    setTxIsInProgress(false)
    setTxIsDone(false)
  }

  const handleOfferCancel = async (): Promise<void> => {
    try {
      setTxIsInProgress(true)
      const storageContract = StorageContract.getInstance(web3 as Web3)
      const terminateOfferRecepipt = await storageContract
        .terminateOffer({ from: account })

      if (terminateOfferRecepipt) {
        confirmationsDispatch({
          type: 'NEW_REQUEST',
          payload: {
            contractAction: 'CANCEL_OFFER',
            txHash: terminateOfferRecepipt.transactionHash,
          },
        })
        setTxIsInProgress(false)
        setTxIsDone(true)
      }
    } catch (error) {
      setTxIsInProgress(false)
      reportError(new UIError({
        error,
        id: 'contract-storage',
        text: 'Could not cancel the offer in the contract.',
      }))
    }
  }

  const handleEditOffer = (offer: StorageOffer): void => {
    editOfferDispatch({
      type: 'SET_OFFER',
      payload: offer as SetOfferPayload,
    })
    history.push(ROUTES.STORAGE.MYOFFERS.EDIT)
  }

  return (
    <CenteredPageTemplate>
      <InfoBar
        isVisible={isProcessingConfs}
        text={`Awaiting confirmations for ${numberOfConfs} offer(s)`}
        type="info"
      />
      <Staking />
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
            You are providing the following storage offers to your customers
          </Typography>
        </Grid>
      </Grid>
      <OffersList
        items={items}
        isLoading={isLoadingData || isProcessingConfs}
        onCancelOffer={handleOfferCancel}
        onEditOffer={handleEditOffer}
      />
      <ProgressOverlay
        isDone={txIsDone}
        inProgress={txIsInProgress}
        title="Canceling your storage offer"
        doneMsg="Your storage offer has been canceled"
        buttons={[
          <RoundBtn
            onClick={handleTxCompletedClose}
          >
            Close
          </RoundBtn>,
        ]}
      />
    </CenteredPageTemplate>
  )
}

export default WithLoginCard({
  WrappedComponent: StorageMyOffersPage,
  title: 'Connect your wallet to see your offers',
  contentText: 'Connect your wallet to get detailed information about your offers',
})
