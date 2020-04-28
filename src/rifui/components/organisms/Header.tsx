import React, { FC, useState } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import { Link, LogoNavbar } from '../../components/atoms';
import { List, AppBar as RUIAppBar } from '../../components/molecules';
import { colors, fonts } from '../../theme';

export interface HeaderProps {
  hreflogo: string;
  items: HeaderItemProps[];
  login: React.ElementType;
}

export interface HeaderItemProps extends NavLinkProps {
  icon?: any;
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

const Header: FC<HeaderProps> = ({ hreflogo, items, login }) => {
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
    <React.Fragment>
      <Hidden smDown>
        <RUIAppBar hreflogo={hreflogo} items={items} login={login} />
      </Hidden>
      <Hidden mdUp>
        <div
          role="presentation"
          onKeyDown={toggleDrawer(false)}>
          <AppBar
            position="static"
            className={
              `${classes.mobileAppBar} ${open ? classes.mobileAppBarShift : ''}`
            }
          >
            <Toolbar>
              {!open && <React.Fragment>
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
              </React.Fragment>}
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
                items.map((headerItem: HeaderItemProps, i: number) => (
                  <ListItem button key={`${headerItem.title}-${i}`}>
                    <NavLink to={headerItem.to} className={classes.mobileNavLink} activeClassName={classes.mobileNavLinkActive}>
                      <ListItemIcon>
                        {headerItem.icon}
                      </ListItemIcon>
                      <ListItemText primary={headerItem.title} />
                    </NavLink>
                  </ListItem>
                ))}
            </List>
          </Drawer>
        </div>
      </Hidden>
    </React.Fragment>
  );
}

export default Header;