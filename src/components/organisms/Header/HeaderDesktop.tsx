import React, { FC } from 'react'
import {
  AppBar, Grid, ListItemIcon, Toolbar,
} from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { NavLink } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import {
  colors, fonts, globalConstants, LogoNavbar, removeEmptySpaces,
} from '@rsksmart/rif-ui'
import { ActionHeaderItemProps, HeaderProps, NavItemProps } from './HeaderProps'

const useStyles = makeStyles((theme: Theme) => ({
  activeNavlink: {
    color: `${colors.white} !important`,
    fontWeight: fonts.weight.medium,
  },
  navLink: {
    alignItems: 'center',
    color: colors.white,
    display: 'flex',
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    textAlign: 'center',
    textDecoration: 'none',
    '&:hover': {
      color: colors.gray5,
      textDecoration: 'none',
    },
  },
  navLinkContainer: {
    display: 'flex',
  },
  root: {
    boxShadow: 'none',
    // this height needs to be equal to the marginTop of PageTemplate
    height: theme.spacing(globalConstants.headerHeight),
  },
}))

const HeaderDesktop: FC<HeaderProps> = ({
  hreflogo, itemsStart, itemsEnd, login,
}) => {
  const classes = useStyles()
  const Login = login

  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar>
        <Grid
          container
        >
          <Grid item xs={1}>
            <NavLink to={hreflogo}>
              <LogoNavbar />
            </NavLink>
          </Grid>
          <Grid
            item
            xs={6}
            container
            justify="flex-start"
          >
            {
            !!itemsStart.length
            && itemsStart.map((navItem: NavItemProps) => (
              <Typography
                className={classes.navLinkContainer}
                key={`hi-${removeEmptySpaces(navItem.title)}`}
              >
                <NavLink
                  className={classes.navLink}
                  activeClassName={classes.activeNavlink}
                  {...navItem}
                >
                  {navItem.title}
                </NavLink>
              </Typography>
            ))
          }
          </Grid>
          <Grid
            item
            xs={4}
            container
            justify="flex-end"
            alignContent="center"
          >
            {
            !!itemsEnd?.length
            && itemsEnd.map(({ icon, onClick }: ActionHeaderItemProps) => (
              <ListItemIcon key={icon.key} {...{ onClick }}>
                {icon}
              </ListItemIcon>
            ))
          }
          </Grid>
          <Grid
            item
            container
            xs={1}
            alignContent="center"
          >
            <Login />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default HeaderDesktop
