import React, { FC } from 'react';
import { Table } from 'react-bootstrap';

import './Marketplace.css';
import { MarketData } from 'models/Market';

export interface MarketplaceProps {
  className?: string;
  data: MarketData;
}

const Marketplace: FC<MarketplaceProps> = ({ className = '', data }) => {
  const { headers, content } = data;
  return (
    <div className={'marketplace ' + className}>
      <div className="content">
        <Table striped borderless hover responsive="sm">
          <thead>
            <tr>
              {headers.map(header => (
                <th>{header}</th>
              ))}
              {/* <th>PROVIDER</th>
              <th>AVAILABLE SIZE</th>
              <th>PRICE PER GB/MONTH</th>
              <th>REPUTATION</th>
              <th>CONTRACT LENGTH</th> */}
            </tr>
          </thead>
          <tbody>
            {content.map(row => (
              <tr>
                {row.map(cell => (
                  <th>{cell}</th>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Marketplace;
