import React from 'react';
import { ROUTES } from 'routes';
import { Header as RUIHeader } from '@rsksmart/rif-ui';
// TODO: remove the dist path once it's ready in the library
import { HeaderItemProps } from '@rsksmart/rif-ui/dist/components/organisms/Header/Header';
import InfoIcon from '@material-ui/icons/Info';
import PeopleIcon from '@material-ui/icons/People';
import StorageIcon from '@material-ui/icons/Storage';
import Login from 'components/atoms/Login';

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
      title: 'About',
      to: ROUTES.ABOUT,
      icon: <InfoIcon />
    },
  ];

  return (<RUIHeader hreflogo={ROUTES.LANDING} items={headerItems} login={Login} />)
};

export default Header;
