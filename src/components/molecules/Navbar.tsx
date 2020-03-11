import React, { FC } from 'react';
import {
  Navbar as BSNavbar,
  NavbarProps as BSNavbarProps,
  Nav,
} from 'react-bootstrap';

import { NavItemProps } from 'components/atoms/navigation/NavItem';
import { LogoNavbar } from 'rifui';
import { ROUTES } from 'routes';
import { LinkContainer } from 'react-router-bootstrap';

export interface NavbarProps extends BSNavbarProps {
  items: NavItemProps[];
  login: React.ElementType;
}

const Navbar: FC<NavbarProps> = ({ items, login }) => {
  const Login = login;

  return (
    <BSNavbar
      style={{ border: '1px solid #ced4da', borderRadius: '.25rem' }}
      expand="lg"
    >
      <LinkContainer to={ROUTES.LANDING}>
        <BSNavbar.Brand>
          <LogoNavbar />
        </BSNavbar.Brand>
      </LinkContainer>
      <Nav className="mr-auto flex-row" variant="pills" activeKey="/">
        {!!items.length &&
          items.map((item: NavItemProps, i) => (
            <Nav.Item key={item.text + i}>
              <LinkContainer to={item.to}>
                <Nav.Link>{item.text}</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          ))}
      </Nav>
      <Nav className="justify-content-end">
        <Login />
      </Nav>
    </BSNavbar>
  );
};

export default Navbar;
