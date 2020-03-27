import React from 'react';
import { ROUTES } from 'routes';
import Web3Provider from 'rifui/providers/Web3Provider';
import { Account } from 'rifui';
import { NavItemProps } from 'rifui/components/molecules/Navbar';
import Navbar from 'components/molecules/Navbar';

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
  // const {
  //   state: {
  //     UserState: { user, isSigningIn = true },
  //   },
  // } = useContext(UserStore);

  const navItems: NavItemProps[] = [
    {
      text: 'Domains',
      href: ROUTES.DOMAINS,
    },
    {
      text: 'Storage',
      href: ROUTES.STORAGE,
    },
  ];

  return <Navbar hreflogo={ROUTES.LANDING} items={navItems} login={Login} />;
};

export default Header;
