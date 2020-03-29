import React, { FC } from 'react';
import {
  TableBody as MUITableBody,
  TableBodyProps as MUITableBodyProps,
} from '@material-ui/core';

export interface TableBodyProps extends MUITableBodyProps { }

const TableBody: FC<TableBodyProps> = ({ children, ...rest }) => (
  <MUITableBody {...rest}>{children}</MUITableBody>
);

export default TableBody;
