import React, { FC } from 'react';
import {
  TableHead as MUITableHead,
  TableHeadProps as MUITableHeadProps,
} from '@material-ui/core';

export interface TableHeadProps extends MUITableHeadProps { }

const TableHead: FC<TableHeadProps> = ({ children, ...rest }) => (
  <MUITableHead {...rest}>{children}</MUITableHead>
);

export default TableHead;
