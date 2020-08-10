import React, { FC } from 'react'
import Tabs from '@material-ui/core/Tabs'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { colors } from '@rsksmart/rif-ui'

export interface StyledTabsProps {
  value: number
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void
}

const useStyles = makeStyles((theme: Theme) => ({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      width: '100%',
      backgroundColor: colors.gray5,
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  root: {
    borderBottom: `1px solid ${colors.gray3}`,
  },
}))

const StyledTabs: FC<StyledTabsProps> = (props: StyledTabsProps) => {
  const classes = useStyles()
  return (
    <Tabs classes={classes} {...props} TabIndicatorProps={{ children: <span /> }} />
  )
}

export default StyledTabs
