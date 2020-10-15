import React, { FC } from 'react'
import {
  Tabs, Tab, makeStyles, Divider, TabsProps,
} from '@material-ui/core'
import { Modify } from 'utils/typeUtils'

const useTabsStyles = makeStyles(() => ({
  root: {
    boxShadow: 'unset',
    overflow: 'visible',
  },
  fixed: {
    overflow: 'visible !important',
  },
  indicator: {
    height: '0px',
  },
}))
const useTabItemStyles = makeStyles(() => ({
  root: {
    lineHeight: 'inherit',
  },
  textColorInherit: {
    opacity: 0.4,
  },
}))
const useDividerStyles = makeStyles(() => ({
  root: {
    height: '29px',
    width: '2px',
    alignSelf: 'center',
  },
}))

export type StoragePinTabsProps = Modify<TabsProps, {
  value: boolean
  onChange: (event: React.ChangeEvent<{}>, value: unknown) => void
}>

const StoragePinTabs: FC<StoragePinTabsProps> = ({ ...props }) => {
  const tabsStylesClasses = useTabsStyles()
  const tabItemStylesClasses = useTabItemStyles()
  const dividerStyleClasses = useDividerStyles()

  return (
    <Tabs
      classes={tabsStylesClasses}
      indicatorColor="primary"
      textColor="primary"
      {...props}
    >
      <Tab classes={tabItemStylesClasses} label="Upload file" value={false} />
      <Divider orientation="vertical" flexItem classes={dividerStyleClasses} />
      <Tab classes={tabItemStylesClasses} label="Pin by hash" value />
    </Tabs>
  )
}

export default StoragePinTabs
