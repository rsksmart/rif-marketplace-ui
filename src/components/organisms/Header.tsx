import React from 'react';
import { ROUTES } from 'routes';
import Web3Provider from 'rifui/providers/Web3Provider';
import { Account, Navbar } from 'rifui';
import { NavLinkProps } from 'react-router-dom';

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
  const navItems: NavLinkProps[] = [
    {
      title: 'Domains',
      to: ROUTES.DOMAINS.BUY,
    },
    {
      title: 'Storage',
      to: ROUTES.STORAGE,
    },
    {
      title: 'Payments',
      to: ROUTES.PAYMENTS
    },
    {
      title: 'Data Services',
      to: ROUTES.DATA_SERVICE
    },
    {
      title: 'Communications',
      to: ROUTES.COMMUNICATIONS
    }
  ];

  return <Navbar hreflogo={ROUTES.LANDING} items={navItems} login={Login} />;
};

export default Header;
