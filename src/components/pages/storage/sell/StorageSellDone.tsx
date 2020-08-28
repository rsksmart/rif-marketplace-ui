import React from 'react'
import TxCompletePageTemplate from 'components/templates/TxCompletePageTemplate'
import { JobDoneBox } from 'components/molecules'

const StorageSellDone = () => (
  <TxCompletePageTemplate>
    <JobDoneBox text="Your offer has been listed." />
  </TxCompletePageTemplate>
)

export default StorageSellDone
