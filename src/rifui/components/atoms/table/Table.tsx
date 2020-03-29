import React, { FC } from 'react';
import {
  Table as MUITable,
  TableProps as MUITableProps,
} from '@material-ui/core';

export interface TableProps extends MUITableProps { }

const Table: FC<TableProps> = ({ children, ...rest }) => (
  <MUITable {...rest}>{children}</MUITable>
);

export default Table;
