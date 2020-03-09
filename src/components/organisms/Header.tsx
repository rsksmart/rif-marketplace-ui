import Navbar from 'components/molecules/Navbar';
import React, { useContext } from 'react';
import { NavItemProps } from 'components/atoms/navigation/NavItem';
import { ROUTES } from 'routes';
import UserStore from 'store/User/UserStore';
import Button from 'components/atoms/buttons/Button';
import { Form, FormControl } from 'components/atoms/forms';

const Header = () => {
  const {
    state: {
      UserState: { user, isSigningIn = true },
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
    if (!isSigningIn)
      return (
        <Button
          onClick={login}
          style={{
            color: '#FFFFFF',
            backgroundColor: '#008CFF',
            borderColor: '#008CFF',
            fontWeight: 500,
            borderRadius: '40px',
            fontFamily: 'Rubik',
            fontSize: '14px',
            padding: '3px 15px!important',
          }}
        >
          Login
        </Button>
      );

    return (
      <Form>
        <FormControl size="sm" type="text"></FormControl>
      </Form>
    );
  };

  return <Navbar items={navItems} login={login} />;
};

export default Header;
