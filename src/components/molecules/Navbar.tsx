import React, { FC } from 'react';
import { Navbar as RifNavbar } from 'rifui';
import { NavbarProps } from 'rifui/components/molecules/Navbar';

const Navbar: FC<NavbarProps> = (props) => {
  return (
    <RifNavbar {...props}>
    </RifNavbar>
  );
};

export default Navbar;
