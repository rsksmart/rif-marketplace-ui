import React, { FC } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import AppBar, { AppBarProps } from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import { LogoNavbar, Link, Typography } from '../atoms/index';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // root: {
    //   '& > * + *': {
    //     marginLeft: theme.spacing(2),
    //   },
    // },
    itemsContainer: {
      alignSelf: 'center',
      display: 'flex',
      marginLeft: 'auto'
    },
    link: {
      color: '#FFF',
      fontWeight: 300,
      // .ito - when active, set to 500
      paddingRight: theme.spacing(5),
      paddingLeft: theme.spacing(5),
      '&:hover': {
        color: "#000",
      },
    },
    loginContainer: {
      marginLeft: 'auto',
    }
  }),
);

export interface NavItemProps {
  text: string;
  href: string;
};

export interface NavbarProps extends AppBarProps {
  hreflogo: string;
  items: NavItemProps[];
  login: React.ElementType;
};

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
            items.map((navItem: NavItemProps, i) => (
              <Typography key={`${navItem.text}-${i}`}>
                <Link className={classes.link} href={navItem.href}>
                  {navItem.text}
                </Link>
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