import React, { FC } from 'react';
import AppBar, { AppBarProps } from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { LogoNavbar, Link, Typography } from 'rifui/components/atoms/index';
import { colors, fonts } from 'rifui/theme';

export interface NavbarProps extends AppBarProps {
  hreflogo: string;
  items: NavLinkProps[];
  login: React.ElementType;
};

const useStyles = makeStyles((theme: Theme) => ({
  itemsContainer: {
    display: 'flex',
  },
  navLinkContainer: {
    minWidth: '50',
    maxWidth: 200,
  },
  navLink: {
    color: colors.white,
    minWidth: '100%',
    minHeight: '100%',
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    '&:hover': {
      color: colors.gray5,
      textDecoration: 'none',
    },
  },
  activeNavlink: {
    color: `${colors.white} !important`,
    fontWeight: fonts.weight.bold
  },
  loginContainer: {
    marginLeft: 'auto',
  }
}));

const Navbar: FC<NavbarProps> = ({ children, items, login, ...rest }) => {

  const classes = useStyles();
  const Login = login;

  return (
    <AppBar position='static' {...rest} >
      <Toolbar>
        <Link href={rest.hreflogo}>
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
    </AppBar >
  );
}

export default Navbar;