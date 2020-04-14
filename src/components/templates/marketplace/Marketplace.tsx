import React, { FC } from 'react';

import { MarketItemType } from 'models/Market';
import { Table, TableHead, TableRow, TableCell, TableBody } from 'rifui';
import { makeStyles, Theme } from '@material-ui/core';

export interface TableHeaders {
  [itemName: string]: string | React.ElementType
}
export interface MarketplaceProps {
  className?: string;
  items: MarketItemType[];
  headers: TableHeaders;
}

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    flex: 1,
    padding: theme.spacing(2),
  },
  root: {
    display: 'flex',
    flex: '1 1 auto'
  },
  th: {
    align: 'center'
  },
  'tc-domain': {
    align: 'left'
  }
}));

const Marketplace: FC<MarketplaceProps> = ({
  className = '',
  items,
  headers,
}) => {
  const classes = useStyles();
  return (
    <div className={`${classes.root} ${className}`}>
      <div className={classes.content}>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(headers).map((itemName: string) => (
                <TableCell className={classes[`th ${itemName}`]} key={`th-${itemName}`}>{headers[itemName]}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item._id}>
                {
                  Object.keys(headers).map((itemName: string) => (
                    <TableCell className={classes[`tc-${itemName}`]} key={item._id + itemName}>
                      {item[itemName]}
                    </TableCell>
                  ))
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Marketplace;
