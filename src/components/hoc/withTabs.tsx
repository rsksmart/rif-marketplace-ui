/* eslint-disable-next-line import/no-unresolved */
import { StyledNavTabProps } from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'
import TabsTemplate from 'components/templates/TabsTemplate'
import React from 'react'
import { useLocation } from 'react-router-dom'
import ROUTES from 'routes'

interface Options {
    tabs: StyledNavTabProps[]
    title: string
}

const withTabs = ({ tabs, title }: Options) => (WrappedComponent: React.ElementType) => {
  const location = useLocation()

  const getTabValueFromLocation = () => {
    const { pathname } = location
    const activeTab = tabs.find((tab) => pathname.includes(tab.to))
    return activeTab?.to || ROUTES.LANDING
  }

  return (
    <TabsTemplate
      title={title}
      value={getTabValueFromLocation()}
      tabs={tabs}
    >
      <WrappedComponent />
    </TabsTemplate>
  )
}

export default withTabs
