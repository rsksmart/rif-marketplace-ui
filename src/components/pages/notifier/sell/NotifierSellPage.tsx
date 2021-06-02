import WithLoginCard from 'components/hoc/WithLoginCard'
import ProviderEdit from 'components/organisms/notifier/offers/ProviderEdit'
import React, { FC } from 'react'

const NotifierSellPage: FC = () => <ProviderEdit mode="CREATE" />

// if this wrapper is removed, the account could be undefined
// and the account handler should change
export default WithLoginCard({
  WrappedComponent: NotifierSellPage,
  title: 'Connect your wallet to register as a provider',
  contentText: 'Please, connect your wallet in order to register as a provider.',
})
