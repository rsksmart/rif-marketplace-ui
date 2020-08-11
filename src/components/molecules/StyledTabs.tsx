import React, { FC } from 'react'
import Tabs, { TabsProps } from '@material-ui/core/Tabs'
import { makeStyles } from '@material-ui/core/styles'
import { colors } from '@rsksmart/rif-ui'

export interface StyledTabsProps {
  value: string
  onChange: (event: React.ChangeEvent<{}>, newValue: string) => void
}

const useStyles = makeStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  root: {
    borderBottom: `1px solid ${colors.gray3}`,
  },
})

const StyledTabs: FC<TabsProps> = (props: TabsProps) => {
  const { children } = props
  const classes = useStyles()
  return (
    <Tabs classes={classes} {...props}>
      {children}
    </Tabs>
  )
}

export default StyledTabs
