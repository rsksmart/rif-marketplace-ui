import React, { FC } from 'react';

export interface TableCellProps {
  className?: string;
}

const TableCell: FC<TableCellProps> = ({ className = '' }) => {
  return <div className={'tableCell ' + className}></div>;
};

export default TableCell;
