import React, { FC } from 'react';
import { Table } from 'react-bootstrap';

import './Marketplace.css';

export interface MarketplaceProps {
  className?: string;
}

const Marketplace: FC<MarketplaceProps> = ({ className = '' }) => {
  return (
    <div className={'marketplace ' + className}>
      <div className="content">
        <Table striped borderless hover responsive="sm">
          <thead>
            <tr>
              <th>PROVIDER</th>
              <th>AVAILABLE SIZE</th>
              <th>PRICE PER GB/MONTH</th>
              <th>REPUTATION</th>
              <th>CONTRACT LENGTH</th>
            </tr>
          </thead>
        </Table>
      </div>
    </div>
  );
};

export default Marketplace;
