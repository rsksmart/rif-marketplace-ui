import React, { FC, useState } from 'react'
import {
  Theme, Tabs, Tab, makeStyles, Divider, TabsProps,
} from '@material-ui/core'
import { Modify } from 'utils/typeUtils'

// Styles source: https://mui-treasury.com/styles/tabs/
const useTabsStyles = makeStyles(() => ({
  root: {
    boxShadow: 'unset',
    overflow: 'visible',
    marginTop: '20px',
  },
  fixed: {
    overflow: 'visible !important',
  },
  indicator: {
    height: 0,
  },
}))
const useTabItemStyles = makeStyles((
  {
    breakpoints,
  }: Pick<Theme, 'breakpoints'>,
): unknown => ({
//   root: {
//     lineHeight: 'inherit',
//     minWidth: 0,
//     '&:not(:last-child)': {
//       marginRight: 24,
//       [breakpoints.up('sm')]: {
//         marginRight: 60,
//       },
//     },
//     [breakpoints.up('md')]: {
//       minWidth: 0,
//     },
//   },
//   labelIcon: {
//     minHeight: 53,
//     '& $wrapper > *:first-child': {
//       marginBottom: 0,
//     },
//   },
//   textColorInherit: {
//     opacity: 0.4,
//   },
//   wrapper: {
//     flexDirection: 'row',
//     letterSpacing: '1px',
//     textTransform: 'uppercase',
//     '& svg, .material-icons': {
//       fontSize: 16,
//       marginRight: 8,
//     },
//   },
}))

export type StoragePinTabsProps = Modify<TabsProps, {
  value: number
  onChange: (event: React.ChangeEvent<{}>, value: any) => void
}>

const StoragePinTabs: FC<StoragePinTabsProps> = ({ ...props }) => {
  const tabsStylesClasses = useTabsStyles()
  const tabItemStylesClasses = useTabItemStyles()

  return (
    <Tabs
      classes={tabsStylesClasses}
      indicatorColor="primary"
      textColor="primary"
      {...props}
    >
      <Tab classes={tabItemStylesClasses} label="Upload file" />
      <Divider orientation="vertical" flexItem style={{ height: '29px', width: '2px', alignSelf: 'center' }} />
      <Tab classes={tabItemStylesClasses} label="Pin by hash" />
    </Tabs>
  )
}

export default StoragePinTabs