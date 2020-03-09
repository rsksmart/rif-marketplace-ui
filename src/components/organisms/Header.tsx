import Navbar from 'components/molecules/Navbar';
import React, { useContext } from 'react';
import { NavItemProps } from 'components/atoms/navigation/NavItem';
import { ROUTES } from 'routes';
import { NavLinkProps } from 'components/atoms/navigation/NavLink';

const Header = () => {
  const navItems: NavItemProps[] = [
    {
      text: 'Domains',
      to: ROUTES.DOMAINS,
    },
    {
      text: 'Storage',
      to: ROUTES.STORAGE,
    },
  ];

  const login = () => {};

  return <Navbar items={navItems} login={login} />;
};

export default Header;
