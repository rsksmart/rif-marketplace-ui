import Typography from '@material-ui/core/Typography'
import React, {
  FC, useContext, useEffect, useState,
} from 'react'
import { Web3Store } from '@rsksmart/rif-ui'
import AppContext, { errorReporterFactory } from 'context/App/AppContext'
import { OfferEditContextProvider } from 'context/Market/storage/OfferEditContext'
import { StorageOffer } from 'models/marketItems/StorageItem'
import { StorageOffersService } from 'api/rif-marketplace-cache/storage/offers'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import OfferCreationPage from './OfferCreationPage'

const Wrapper: FC = () => {
  const {
    state: {
      account,
    },
  } = useContext(Web3Store)
  const { state: appState, dispatch: appDispatch } = useContext(AppContext)
  const [isLoadingOffer, setIsLoadingOffer] = useState(false)
  const [ownOffer, setOwnOffer] = useState<StorageOffer | undefined>(undefined)

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

  const renderContent = (): JSX.Element => (
    ownOffer
      ? (
        <Typography>
          Creation of multiple offers is not supported yet.
          You can edit your current offer on &quot;My Offers&quot; section
        </Typography>
      )
      : (
        <OfferEditContextProvider>
          <OfferCreationPage isLoading={isLoadingOffer} />
        </OfferEditContextProvider>
      )
  )

  return (
    <CenteredPageTemplate>
      {renderContent()}
    </CenteredPageTemplate>
  )
}

export default Wrapper
