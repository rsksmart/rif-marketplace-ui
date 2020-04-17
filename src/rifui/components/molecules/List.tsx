import React, { FC } from 'react';
import { List as MUIList, ListProps as MUIListProps } from '@material-ui/core';

export interface ListProps extends MUIListProps { };

const List: FC<ListProps> = ({ children, ...rest }) => {
  return (
    <MUIList {...rest}>
      {children}
    </MUIList>
  );
};

export default List;
