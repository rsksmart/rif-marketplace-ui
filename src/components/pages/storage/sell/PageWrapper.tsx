import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import { Web3Store } from '@rsksmart/rif-ui'
import AppContext, { errorReporterFactory } from 'context/App/AppContext'
import { OfferEditContextProvider } from 'context/Market/storage/OfferEditContext'
import { StorageOffer } from 'models/marketItems/StorageItem'
import { StorageOffersService } from 'api/rif-marketplace-cache/storage/offers'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import Staking from 'components/organisms/storage/staking/Staking'
import InfoBar from 'components/molecules/InfoBar'
import useConfirmations from 'hooks/useConfirmations'
import NoMultipleOffersCard from 'components/organisms/storage/sell/NoMultipleOffersCard'
import OfferCreation from 'components/organisms/storage/sell/OfferCreation'

const PageWrapper: FC = () => {
  const {
    state: {
      account,
    },
  } = useContext(Web3Store)
  const { state: appState, dispatch: appDispatch } = useContext(AppContext)
  const [isLoadingOffer, setIsLoadingOffer] = useState(false)
  const [ownOffer, setOwnOffer] = useState<StorageOffer | undefined>(undefined)

  const numberOfConfs = useConfirmations(
    ['NEW_OFFER', 'EDIT_OFFER', 'CANCEL_OFFER'],
  ).length
  const isAwaitingConfs = Boolean(numberOfConfs)

  useEffect(() => {
    if (account) {
      const getOwnOffers = async (): Promise<void> => {
        setIsLoadingOffer(true)

        const offersService = appState.apis['storage/v0/offers'] as StorageOffersService
        offersService.connect(errorReporterFactory(appDispatch))

        const currentOwnOffers = await offersService.fetch({
          nonActive: true,
          provider: account,
        }) as StorageOffer[]

        setOwnOffer(currentOwnOffers[0])
        setIsLoadingOffer(false)
      }

      getOwnOffers()
    }
  }, [account, appDispatch, appState])

  if (ownOffer) {
    return (
      <CenteredPageTemplate>
        <NoMultipleOffersCard />
      </CenteredPageTemplate>
    )
  }

  return (
    <CenteredPageTemplate>
      <InfoBar
        text={`Awaiting confirmations for ${numberOfConfs} offer(s)`}
        type="info"
        isVisible={isAwaitingConfs}
      />
      <Staking />
      <OfferEditContextProvider>
        <OfferCreation isLoading={isLoadingOffer || isAwaitingConfs} />
      </OfferEditContextProvider>
    </CenteredPageTemplate>
  )
}

export default PageWrapper
