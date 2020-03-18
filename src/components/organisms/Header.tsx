import Navbar from 'components/molecules/Navbar';
import React, { useContext } from 'react';
import { NavItemProps } from 'components/atoms/navigation/NavItem';
import { ROUTES } from 'routes';
import UserStore from 'store/User/UserStore';
import Account from 'rifui/components/Account';
import Web3Provider from 'rifui/providers/Web3Provider';

const Login = () => (
  <Web3Provider.Consumer>
    {({ state: { web3, networkName, account }, actions: { setProvider } }) => (
      <Account
        web3={web3}
        networkName={networkName}
        account={account}
        setProvider={setProvider}
      />
    )}
  </Web3Provider.Consumer>
);

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

  return <Navbar items={navItems} login={Login} />;
};

export default Header;
