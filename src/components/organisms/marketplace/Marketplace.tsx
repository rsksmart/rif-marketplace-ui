import React, { FC } from 'react';
import { Table } from 'react-bootstrap';

import './Marketplace.css';
import { MarketItemType } from 'models/Market';
import { TableHead, TableRow, TableCell, TableBody } from 'rifui';

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
                <TableCell className={`th-${itemName}`} key={`th-${itemName}`}>{headers[itemName]}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item._id}>
                {
                  Object.keys(headers).map((itemName: string) => (
                    <TableCell className={`tc-${itemName}`} key={item._id + itemName}>
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
