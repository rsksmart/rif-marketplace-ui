import { JobDoneBox } from 'components/molecules'
import TxCompletePageTemplate from 'components/templates/TxCompletePageTemplate'
import React, { FC } from 'react'

const StorageMyOffersCancelled: FC = () => (
  <TxCompletePageTemplate>
    <JobDoneBox text="Your storage offer has been cancelled." />
  </TxCompletePageTemplate>
)

export default StorageMyOffersCancelled
