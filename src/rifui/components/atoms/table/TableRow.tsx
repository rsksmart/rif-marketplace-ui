import React, { FC } from 'react';
import {
  TableRow as MUITableRow,
  TableRowProps as MUITableRowProps,
} from '@material-ui/core';

export interface TableRowProps extends MUITableRowProps {}

const TableRow: FC<TableRowProps> = ({ children, ...rest }) => (
  <MUITableRow {...rest}>{children}</MUITableRow>
);

export default TableRow;
