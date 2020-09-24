import Login from 'components/atoms/Login'
import RoundedCard from 'components/atoms/RoundedCard'
import EditOfferStepper from 'components/organisms/storage/sell/EditOfferStepper'
import CenteredPageTemplate from 'components/templates/CenteredPageTemplate'
import React, { FC } from 'react'

const StorageEditOfferPage: FC<{}> = () => {
  // TODO: if no account or no offer selected -> redirect to MyOffers page
  // TODO: define end handler to submit the edition
  // TODO: dispatch CLEAN_UP function

  const endHandler = <Login />
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
