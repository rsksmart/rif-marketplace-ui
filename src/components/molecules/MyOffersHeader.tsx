import handProvidingFunds from 'assets/images/handProvidingFunds.svg'
import React, {
  FC,
} from 'react'
import TabHeader from './TabHeader'

const MyOffersHeader: FC = ({ children }) => (
  <TabHeader
    title="You are providing the following plans to your customers"
    icon={<img src={handProvidingFunds} alt="hand providing funds" />}
  >
    {children}
  </TabHeader>
)

export default MyOffersHeader
