import React, { FC } from 'react';
import { Link as MUILink, LinkProps as MUILinkProps } from '@material-ui/core';

export interface LinkProps extends MUILinkProps { };

const Link: FC<LinkProps> = (props) => {
  return (
    <MUILink {...props}>
    </MUILink>
  );
};

export default Link;