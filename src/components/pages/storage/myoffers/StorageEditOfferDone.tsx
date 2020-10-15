import { JobDoneBox } from 'components/molecules'
import TxCompletePageTemplate from 'components/templates/TxCompletePageTemplate'
import React, { FC } from 'react'

const StorageEditOfferDone: FC<{}> = () => (
  <TxCompletePageTemplate>
    <JobDoneBox text="Your offer has been edited." />
  </TxCompletePageTemplate>
)

export default StorageEditOfferDone
