import React, { FC } from 'react';
import AppBar, { AppBarProps } from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';

import { LogoNavbar, Link, Typography } from '../atoms/index';

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
  const Login = login;
  return (
    <AppBar position='static' {...rest} >
      <Toolbar>
        <Link href={rest.hreflogo}>
          <LogoNavbar></LogoNavbar>
        </Link>
        {!!items.length &&
          items.map((navItem: NavItemProps, i) => (
            <Typography key={`${navItem.text}-${i}`}>
              <Link href={navItem.href}>
                {navItem.text}
              </Link>
            </Typography>
          ))}
        <Divider />
        <Login />
      </Toolbar>
    </AppBar >
  );
}

export default Navbar;