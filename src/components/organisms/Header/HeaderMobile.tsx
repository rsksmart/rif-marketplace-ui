import React, { FC, useState } from 'react'
import {
  AppBar,
  Divider,
  Drawer, Toolbar,
  IconButton, List, ListItem,
  ListItemText, ListItemIcon, Grid,
} from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import {
  colors, globalConstants, LogoNavbar, removeEmptySpaces,
} from '@rsksmart/rif-ui'
import { ActionHeaderItemProps, HeaderProps, NavItemProps } from './HeaderProps'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => createStyles({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  drawerPaper: {
    width: drawerWidth,
  },
  mobileAppBar: {
    boxShadow: 'none',
    // this height needs to be equal to the marginTop of PageTemplate
    height: theme.spacing(globalConstants.headerHeight),
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  mobileAppBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  mobileNavLink: {
    alignItems: 'center',
    color: colors.gray4,
    display: 'flex',
    textDecoration: 'none',
    width: '100%',
    '&:hover': {
      color: colors.gray5,
      textDecoration: 'none',
    },
  },
  mobileNavLinkActive: {
    color: `${colors.primary} !important`,
  },
}))

const HeaderMobile: FC<HeaderProps> = ({
  hreflogo, itemsStart, itemsEnd, login: Login,
}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const toggleDrawer = (isOpen: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ): void => {
    if (
      event.type === 'keydown'
      && ((event as React.KeyboardEvent).key === 'Tab'
        || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    setOpen(isOpen)
  }

  return (
    <div
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <AppBar
        position="fixed"
        className={
          `${classes.mobileAppBar} ${open ? classes.mobileAppBarShift : ''}`.trim()
        }
      >
        <Toolbar>
          {!open && (
            <Grid container>
              <Grid item xs={1}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
              <Grid item xs={6}>
                <NavLink to={hreflogo}>
                  <LogoNavbar />
                </NavLink>
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
              <ListItemIcon {...{ onClick }}>
                {icon}
              </ListItemIcon>
            ))
          }
              </Grid>
              <Grid item xs={1}>
                <Login />
              </Grid>
            </Grid>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClick={toggleDrawer(false)}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={toggleDrawer(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {
            !!itemsStart.length
            && itemsStart.map((headerItem: NavItemProps) => (
              <ListItem
                button
                key={`him-${removeEmptySpaces(headerItem.title)}`}
              >
                <NavLink
                  to={headerItem.to}
                  className={classes.mobileNavLink}
                  activeClassName={classes.mobileNavLinkActive}
                >
                  <ListItemIcon>
                    {headerItem.icon}
                  </ListItemIcon>
                  <ListItemText primary={headerItem.title} />
                </NavLink>
              </ListItem>
            ))
          }
        </List>
      </Drawer>
    </div>

  )
}

export default HeaderMobile
