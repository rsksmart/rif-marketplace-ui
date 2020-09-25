import { Button } from '@rsksmart/rif-ui'
import RoundedCard from 'components/atoms/RoundedCard'
import EditOfferStepper from 'components/organisms/storage/sell/EditOfferStepper'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import React, { FC } from 'react'
import Logger from 'utils/Logger'

const logger = Logger.getInstance()
const StorageEditOfferPage: FC<{}> = () => {
  // TODO: if no account or no offer selected (!editing) -> redirect to MyOffers page
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
      {/* TODO: add className */}
      <RoundedCard color="primary">
        <EditOfferStepper endHandler={endHandler} />
      </RoundedCard>
    </CenteredPageTemplate>
  )
}

export default StorageEditOfferPage
