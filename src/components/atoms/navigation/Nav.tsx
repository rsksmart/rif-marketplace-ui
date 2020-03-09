import React, { FC } from 'react';
import { Nav as BSNav, NavProps as BSNavProps } from 'react-bootstrap';
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers';

interface Props extends BSNavProps {
  position: 'start' | 'center' | 'end';
}

export type NavProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & Props
>;

const Nav: FC<NavProps> = ({ position, children, ...rest }) => (
  <BSNav className={`ml-auto justify-content-${position}`} {...rest}>
    {children}
  </BSNav>
);
export default Nav;
