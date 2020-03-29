import React, { FC } from 'react';
import {
  TableCell as MUITableCell,
  TableCellProps as MUITableCellProps,
} from '@material-ui/core';

export interface TableCellProps extends MUITableCellProps { }

const TableCell: FC<TableCellProps> = ({ children, ...rest }) => (
  <MUITableCell {...rest}>{children}</MUITableCell>
);

export default TableCell;
