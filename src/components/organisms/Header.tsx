import Navbar from 'components/molecules/Navbar';
import React, { useContext } from 'react';
import { NavItemProps } from 'components/atoms/navigation/NavItem';
import { ROUTES } from 'routes';
import UserStore from 'store/User/UserStore';
import Button from 'components/atoms/buttons/Button';
import { Form } from 'components/atoms/forms';

const Header = () => {
  const {
    state: {
      UserState: { user, isSigningIn },
    },
  } = useContext(UserStore);

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

  // TODO: Extract component
  const login = () => {
    if (!isSigningIn) return <Button onClick={login}>Login</Button>;

    return <Form></Form>;
  };

  return <Navbar items={navItems} login={login} />;
};

export default Header;
