import React, { FC } from 'react';
import { Table } from 'react-bootstrap';

import './Marketplace.css';
import { MarketItemType } from 'models/Market';
import { TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

export interface TableHeaders {
  [itemName: string]: string | React.ElementType
}
export interface MarketplaceProps {
  className?: string;
  items: MarketItemType[];
  headers: TableHeaders;
}

const Marketplace: FC<MarketplaceProps> = ({
  className = '',
  items,
  headers,
}) => {
  return (
    <div className={'marketplace ' + className}>
      <div className="content">
        <Table striped borderless hover responsive="sm">
          <TableHead>
            <TableRow>
              {Object.keys(headers).map((itemName: string) => (
                <TableCell key={`th-${itemName}`} align='center'>{headers[itemName]}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              items.map(item => (
                <TableRow key={item._id}>
                  {
                    Object.keys(headers).map((itemName: string) => (
                      <TableCell key={item._id + itemName} align='center'>
                        {item[itemName]}
                      </TableCell>
                    ))
                  }
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Marketplace;
