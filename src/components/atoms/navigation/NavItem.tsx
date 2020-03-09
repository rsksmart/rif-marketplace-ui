import React, { FC } from 'react';
import LinkContainer from 'components/atoms/navigation/LinkContainer';
import NavLink from 'components/atoms/navigation/NavLink';

export interface NavItemProps {
  text: string;
  to: string;
}

const NavItem: FC<NavItemProps> = ({ text, to }) => {
  return (
    <LinkContainer to={to}>
      <NavLink text={text} />
    </LinkContainer>
  );
};

export default NavItem;
