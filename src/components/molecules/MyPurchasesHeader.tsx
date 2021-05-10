import shoppingTrolley from 'assets/images/shopping_trolley.svg'
import React, {
  FC,
} from 'react'
import TabHeader from './TabHeader'

const MyOffersHeader: FC = ({ children }) => (
  <TabHeader
    title="You bought the following notification plans"
    icon={<img src={shoppingTrolley} alt="shopping trolley" />}
  >
    {children}
  </TabHeader>
)

export default MyOffersHeader
