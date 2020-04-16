import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { MarketItemType } from 'models/Market';
import { Table, TableHead, TableRow, TableCell, TableBody } from 'rifui';
import { colors, fonts } from 'rifui/theme';

export interface TableHeaders {
  [itemName: string]: string | React.ElementType
}
export interface MarketplaceProps {
  className?: string;
  items: MarketItemType[];
  headers: TableHeaders;
}

const useStyles = makeStyles((theme: Theme) => ({
  coloredRow: {
    background: colors.gray1
  },
  content: {
    flex: 1,
    padding: theme.spacing(2),
  },
  root: {
    display: 'flex',
    flex: '1 1 auto'
  },
  tc: {
    border: 0
  },
  th: {
    color: colors.gray6,
    fontWeight: fonts.weight.normal,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  'tc-domain': {
    align: 'left',
    color: colors.primary,
  },
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
                <TableCell className={classes.th} key={`th-${itemName}`}>{headers[itemName]}</TableCell>
                // <TableCell className={classes[`th ${itemName}`]} key={`th-${itemName}`}>{headers[itemName]}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow className={index % 2 ? classes.coloredRow : ''} key={item._id}>
                {
                  Object.keys(headers).map((itemName: string) => (
                    // .ito - TODO: add custom classes to certain cells
                    <TableCell className={`${classes.tc} ${classes[`tc-${itemName}`]}`} key={item._id + itemName}>
                      {item[itemName]}
                    </TableCell>
                  ))
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div >
  );
};

export default Marketplace;
