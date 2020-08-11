import React, { FC } from 'react'
import { Theme, makeStyles } from '@material-ui/core/styles'
import { colors } from '@rsksmart/rif-ui'
import Tab from '@material-ui/core/Tab'
import { NavLink } from 'react-router-dom'

export interface StyledNavTabProps {
  label: string
  to: string
  value: string
}

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
    borderBottom: '2px solid #000000',
  },
}))

const StyledNavTab: FC<StyledNavTabProps> = (props: StyledNavTabProps) => {
  const classes = useStyles()
  return <Tab classes={classes} component={NavLink} disableRipple {...props} />
}

export default StyledNavTab
