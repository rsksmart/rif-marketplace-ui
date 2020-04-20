import React, { useState } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Hidden from '@material-ui/core/Hidden';
import { LogoNavbar, Link, List, Typography } from 'rifui';
import { colors, fonts } from 'rifui/theme';

export interface HeaderProps {
  hreflogo: string;
  items: NavLinkProps[];
  login: React.ElementType;
}

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    activeNavlink: {
      color: `${colors.white} !important`,
      fontWeight: fonts.weight.bold
    },
    itemsContainer: {
      display: 'flex',
    },
    loginContainer: {
      display: 'flex',
      marginLeft: 'auto',
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
      display: 'flex'
    },
    // Small devices styles below
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
  }),
);

const Header = ({ hreflogo, items, login }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const Login = login;

  const toggleDrawer = (isOpen: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setOpen(isOpen);
  };

  return (
    <>
      <Hidden smDown>
        <AppBar
          position="static">
          <Toolbar>
            <Link href={hreflogo}>
              <LogoNavbar />
            </Link>
            <div className={classes.itemsContainer}>
              {
                !!items.length &&
                items.map((navItem: NavLinkProps, i) => (
                  <Typography className={classes.navLinkContainer} key={`${navItem.title}-${i}`}>
                    <NavLink className={classes.navLink} activeClassName={classes.activeNavlink} to={navItem.to}>
                      {navItem.title}
                    </NavLink>
                  </Typography>
                ))
              }
            </div>
            <div className={classes.loginContainer}>
              <Login />
            </div>
          </Toolbar>

        </AppBar>
      </Hidden>
      <Hidden mdUp>
        <div
          role="presentation"
          onKeyDown={toggleDrawer(false)}>
          <AppBar
            position="static"
            className={
              clsx(classes.mobileAppBar, {
                [classes.mobileAppBarShift]: open,
              })
            }
          >
            <Toolbar>
              {!open && <>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
                <Link href={hreflogo}>
                  <LogoNavbar />
                </Link>
                <div className={classes.loginContainer}>
                  <Login />
                </div>
              </>}
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
                !!items.length &&
                items.map((navItem: NavLinkProps, i: number) => (
                  <ListItem button key={`${navItem.title}-${i}`}>
                    <NavLink to={navItem.to} className={classes.mobileNavLink} activeClassName={classes.mobileNavLinkActive}>
                      {/* TODO: if the UX validates displaying icons here, add the prop to items and read it here */}
                      <ListItemIcon>{i % 2 ? <MailIcon /> : <InboxIcon />}</ListItemIcon>
                      <ListItemText primary={navItem.title} />
                    </NavLink>
                  </ListItem>
                ))}
            </List>
          </Drawer>

        </div>
      </Hidden>
    </>
  );
}

export default Header;