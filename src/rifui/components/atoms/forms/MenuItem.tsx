import React, { FC } from 'react';
import { MenuItem as MUIMenuItem, MenuItemProps as MUIMenuItemProps } from '@material-ui/core';

export interface MenuItemProps extends MUIMenuItemProps {
};

// the "| any" is a workaround till https://github.com/mui-org/material-ui/issues/16245 gets resolved.
const MenuItem: FC<MenuItemProps | any> = ({ ...rest }) => {
    return (
        <MUIMenuItem {...rest} />
    );
};

export default MenuItem;