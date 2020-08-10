import React, { FC } from 'react'
import { Theme, makeStyles } from '@material-ui/core/styles'
import { colors } from '@rsksmart/rif-ui'
import Tab, { TabProps } from '@material-ui/core/Tab'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textTransform: 'none',
    color: colors.gray5,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
  selected: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}))

const StyledTab: FC<TabProps> = (props: TabProps) => {
  const classes = useStyles()
  return <Tab classes={classes} disableRipple {...props} />
}

export default StyledTab
