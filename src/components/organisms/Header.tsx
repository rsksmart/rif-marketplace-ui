import React from 'react';
import { ROUTES } from 'routes';
import Web3Provider from 'rifui/providers/Web3Provider';
import { Account, Header as RUIHeader } from 'rifui';
import { HeaderItemProps } from 'rifui/components/organisms/Header';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import ForumIcon from '@material-ui/icons/Forum';
import PeopleIcon from '@material-ui/icons/People';
import StorageIcon from '@material-ui/icons/Storage';

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
  const headerItems: HeaderItemProps[] = [
    {
      title: 'Domains',
      to: ROUTES.DOMAINS.BUY,
      isActive: (_, { pathname }) => {
        return pathname.includes(ROUTES.DOMAINS.BASE)
      },
      icon: <PeopleIcon />
    },
    {
      title: 'Storage',
      to: ROUTES.STORAGE,
      icon: <StorageIcon />
    },
    {
      title: 'Payments',
      to: ROUTES.PAYMENTS,
      icon: <AccountBalanceWalletIcon />
    },
    {
      title: 'Data Services',
      to: ROUTES.DATA_SERVICE,
      icon: <DataUsageIcon />
    },
    {
      title: 'Communications',
      to: ROUTES.COMMUNICATIONS,
      icon: <ForumIcon />
    }
  ];

  return (<RUIHeader hreflogo={ROUTES.LANDING} items={headerItems} login={Login} />)
};

export default Header;
