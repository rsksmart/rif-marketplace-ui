import React, { FC } from 'react';
import {
  Navbar as BSNavbar,
  NavbarProps as BSNavbarProps,
  Nav,
} from 'react-bootstrap';

import { NavItemProps } from 'components/atoms/navigation/NavItem';
import NavBrand from 'components/atoms/navigation/NavBrand';
import Button from 'components/atoms/buttons/Button';
import { LogoNavbar } from 'rifui';
import { ROUTES } from 'routes';
// import Nav from 'components/atoms/navigation/Nav';

export interface NavbarProps extends BSNavbarProps {
  items: NavItemProps[];
  login: Function;
}

const Navbar: FC<NavbarProps> = ({ items, login }) => {
  return (
    <BSNavbar bg="white" expand="lg">
      <BSNavbar.Brand href={ROUTES.LANDING}>
        <LogoNavbar />
      </BSNavbar.Brand>
      <Nav
        className="mr-auto"
        variant="tabs"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginBottom: 0,
          border: 0,
        }}
      >
        {!!items.length &&
          items.map((item: NavItemProps, i) => (
            <Nav.Item key={item.text + i}>
              <Nav.Link href={item.to}>{item.text}</Nav.Link>
            </Nav.Item>
          ))}
      </Nav>
      <Button onClick={login}>Login</Button>
    </BSNavbar>
  );
};

export default Navbar;
