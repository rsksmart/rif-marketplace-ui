import React, { FC } from 'react'
import { NavLink } from 'react-router-dom'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { fonts } from '@rsksmart/rif-ui'
import Icon, { IconProps } from 'components/atoms/Icon'

export interface IconedItemProps {
  className?: string
  iconProps: IconProps
  text: string
  to: string
  description: string
}

const useStyles = makeStyles((_: Theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  iconTitle: {
    display: 'flex',
    justifyContent: 'center',
    fontWeight: fonts.weight.regular,
    '&:hover': {
      fontWeight: fonts.weight.medium,
    },
  },
  iconDescription: {
    display: 'flex',
    wordWrap: 'normal',
    justifyContent: 'center',
  },
  link: {
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
}))

const IconedItem: FC<IconedItemProps> = ({
  className = '', to, text, iconProps, description,
}) => {
  const classes = useStyles()
  return (
    <div className={`${classes.root} ${className}`}>
      <NavLink className={classes.link} to={to}>
        <Icon {...iconProps} />
        <Typography className={classes.iconTitle} variant="h6" color="primary">{text}</Typography>
        <Typography className={classes.iconDescription} color="secondary">{description}</Typography>
      </NavLink>
    </div>
  )
}

export default IconedItem
