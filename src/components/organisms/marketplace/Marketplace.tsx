import React, { FC } from 'react';
import { Table } from 'react-bootstrap';

import './Marketplace.css';
import { MarketItemType } from 'models/Market';

export interface MarketplaceProps {
  className?: string;
  items: MarketItemType[];
  headers: string[];
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
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const cells = Object.keys(item);
              return (
                <tr key={item._id}>
                  {cells
                    .filter(cell => cell !== '_id')
                    .map(cell => (
                      <th key={cell + item._id}>{item[cell]}</th>
                    ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Marketplace;
