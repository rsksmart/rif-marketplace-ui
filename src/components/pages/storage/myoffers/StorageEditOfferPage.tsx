import { Button, Web3Store } from '@rsksmart/rif-ui'
import RoundedCard from 'components/atoms/RoundedCard'
import EditOfferStepper from 'components/organisms/storage/sell/EditOfferStepper'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import { OfferEditContextProps } from 'context/Market/storage/interfaces'
import OfferEditContext from 'context/Market/storage/OfferEditContext'
import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import ROUTES from 'routes'
import Logger from 'utils/Logger'

const logger = Logger.getInstance()
const StorageEditOfferPage: FC<{}> = () => {
  const history = useHistory()
  const {
    state: { account },
  } = useContext(Web3Store)
  const {
    state: { offerId },
  } = useContext<OfferEditContextProps>(OfferEditContext)

  if (!offerId || !account) {
    history.replace(ROUTES.STORAGE.MYOFFERS.BASE)
  }
  // TODO: onClick editOffer define end handler to submit the edition

  const handleEditOffer = () => {
    logger.debug('TODO: send transaction to edit offer')
  }
  const endHandler = <Button color="primary" variant="contained" rounded onClick={handleEditOffer}>Edit offer</Button>
  return (
    <CenteredPageTemplate
      title="Edit your storage offer"
      subtitle="Fill out the fields below to edit your storage offer. All information provided is meant to be true and correct."
    >
      <RoundedCard color="primary">
        <EditOfferStepper endHandler={endHandler} />
      </RoundedCard>
    </CenteredPageTemplate>
  )
}

export default StorageEditOfferPage
